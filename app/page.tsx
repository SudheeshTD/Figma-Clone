// "use client";
// import { fabric } from "fabric";
// import LeftSidebar from "@/components/LeftSidebar";
// import Live from "@/components/Live";
// import Navbar from "@/components/Navbar";
// import RightSidebar from "@/components/RightSidebar";
// import { useEffect, useRef, useState } from "react";
// import {
//   handleCanvaseMouseMove,
//   handleCanvasMouseDown,
//   handleCanvasMouseUp,
//   handleCanvasObjectModified,
//   handleResize,
//   initializeFabric,
//   renderCanvas,
// } from "@/lib/canvas";
// import { ActiveElement } from "@/types/type";
// import { useMutation, useStorage } from "@liveblocks/react";
// import { defaultNavElement } from "@/constants";
// import { LiveMap } from "@liveblocks/client";

// export default function Page() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const fabricRef = useRef<fabric.Canvas | null>(null);

//   const isDrawing = useRef(false);
//   const shapeRef = useRef<fabric.Object | null>(null);
//   const selectedShapeRef = useRef<string | null>(null);

//   const canvasObjects = useStorage((root) => root.canvasObjects);

//   const activeObjectRef = useRef<fabric.Object | null>(null);

//   const syncShapeInStorage = useMutation(({ storage }, object) => {
//     if (!object) return;
//     const { objectId } = object;

//     const shapeData = object.toJSON();
//     shapeData.objectId = objectId;

//     const canvasObjects = storage.get("canvasObjects");

//     canvasObjects.set(objectId, shapeData);
//   }, []);

//   const [activeElement, setActiveElement] = useState<ActiveElement>({
//     name: "",
//     value: "",
//     icon: "",
//   });

//   const deleteAllShapes = useMutation(({ storage }) => {
//     const canvasObjects = storage.get("canvasObjects");
//     if (!canvasObjects || canvasObjects.size === 0) return true;

//     for (const [key, value] of canvasObjects.entries()) {
//       canvasObjects.delete(key);
//     }

//     // return true if the store is empty
//     return canvasObjects.size === 0;
//   }, []);

//   const handleActiveElement = (elem: ActiveElement) => {
//     setActiveElement(elem);

//     switch (elem?.value) {
//       case "reset":
//         deleteAllShapes();

//         fabricRef.current?.clear();

//         setActiveElement(defaultNavElement);
//         break;

//       default:
//         break;

//         selectedShapeRef.current = elem?.value as string;
//     }
//   };

//   useEffect(() => {
//     // initialize the fabric canvas
//     const canvas = initializeFabric({
//       canvasRef,
//       fabricRef,
//     });

//     canvas.on("mouse:down", (options) => {
//       handleCanvasMouseDown({
//         options,
//         canvas,
//         selectedShapeRef,
//         isDrawing,
//         shapeRef,
//       });
//     });

//     canvas.on("mouse:move", (options) => {
//       handleCanvaseMouseMove({
//         options,
//         canvas,
//         isDrawing,
//         selectedShapeRef,
//         shapeRef,
//         syncShapeInStorage,
//       });
//     });

//     canvas.on("mouse:up", () => {
//       handleCanvasMouseUp({
//         canvas,
//         isDrawing,
//         shapeRef,
//         activeObjectRef,
//         selectedShapeRef,
//         syncShapeInStorage,
//         setActiveElement,
//       });
//     });

//     canvas.on("object:modified", (options) => {
//       handleCanvasObjectModified({
//         options,
//         syncShapeInStorage,
//       });
//     });

//     window.addEventListener("resize", () => {
//       handleResize({
//         canvas: fabricRef.current,
//       });
//     });
//   }, [canvasRef]);

//   useEffect(() => {
//     renderCanvas({
//       fabricRef,
//       canvasObjects,
//       activeObjectRef,
//     });
//   }, [canvasObjects]);

//   return (
//     <main className="h-screen overflow-hidden">
//       <Navbar
//         activeElement={activeElement}
//         handleActiveElement={handleActiveElement}
//       />

//       <section className="flex h-full flex-row">
//         <LeftSidebar />
//         <Live canvasRef={canvasRef} />
//         <RightSidebar />
//       </section>
//     </main>
//   );
// }
"use client";

import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";

import { useMutation, useRedo, useUndo } from "@liveblocks/react/suspense";
import {
  handleCanvaseMouseMove,
  handleCanvasMouseDown,
  handleCanvasMouseUp,
  handleCanvasObjectModified,
  handleCanvasObjectMoving,
  handleCanvasObjectScaling,
  handleCanvasSelectionCreated,
  handleCanvasZoom,
  handlePathCreated,
  handleResize,
  initializeFabric,
  renderCanvas,
} from "@/lib/canvas";
import { handleDelete, handleKeyDown } from "@/lib/key-events";
import { handleImageUpload } from "@/lib/shapes";
import { defaultNavElement } from "@/constants";
import { ActiveElement, Attributes } from "@/types/type";
import LeftSidebar from "@/components/LeftSidebar";
import Live from "@/components/Live";
import RightSidebar from "@/components/RightSidebar";
import Navbar from "@/components/Navbar";
import { ClientSideSuspense, useStorage } from "@liveblocks/react/suspense";
import Loader from "@/components/Loader";

export default function Page() {
  const undo = useUndo();
  const redo = useRedo();

  const canvasObjects = useStorage((root) => root.canvasObjects);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  const isDrawing = useRef(false);

  const shapeRef = useRef<fabric.Object | null>(null);

  const selectedShapeRef = useRef<string | null>(null);

  const activeObjectRef = useRef<fabric.Object | null>(null);
  const isEditingRef = useRef(false);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: "",
    value: "",
    icon: "",
  });

  const [elementAttributes, setElementAttributes] = useState<Attributes>({
    width: "",
    height: "",
    fontSize: "",
    fontFamily: "",
    fontWeight: "",
    fill: "#aabbcc",
    stroke: "#aabbcc",
  });
  console.log(canvasObjects); // Should show LiveMap {size: 0}
  console.log(Array.from(canvasObjects)); // Should be []

  const deleteShapeFromStorage = useMutation(({ storage }, shapeId) => {
    const canvasObjects = storage.get("canvasObjects");
    canvasObjects.delete(shapeId);
  }, []);

  const deleteAllShapes = useMutation(({ storage }) => {
    const canvasObjects = storage.get("canvasObjects");

    if (!canvasObjects || canvasObjects.size === 0) return true;

    for (const [key, value] of canvasObjects.entries()) {
      canvasObjects.delete(key);
    }

    return canvasObjects.size === 0;
  }, []);

  const syncShapeInStorage = useMutation(({ storage }, object) => {
    if (!object) return;
    const { objectId } = object;

    const shapeData = object.toJSON();
    shapeData.objectId = objectId;

    const canvasObjects = storage.get("canvasObjects");

    canvasObjects.set(objectId, shapeData);
  }, []);

  const handleActiveElement = (elem: ActiveElement) => {
    setActiveElement(elem);

    switch (elem?.value) {
      case "reset":
        deleteAllShapes();

        fabricRef.current?.clear();
        setActiveElement(defaultNavElement);
        break;

      case "delete":
        handleDelete(fabricRef.current as any, deleteShapeFromStorage);

        setActiveElement(defaultNavElement);
        break;

      case "image":
        imageInputRef.current?.click();

        isDrawing.current = false;

        if (fabricRef.current) {
          fabricRef.current.isDrawingMode = false;
        }
        break;

      case "comments":
        break;

      default:
        selectedShapeRef.current = elem?.value as string;
        break;
    }
  };

  useEffect(() => {
    // initialize the fabric canvas
    const canvas = initializeFabric({
      canvasRef,
      fabricRef,
    });

    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        selectedShapeRef,
        isDrawing,
        shapeRef,
      });
    });

    canvas.on("mouse:move", (options) => {
      handleCanvaseMouseMove({
        options,
        canvas,
        isDrawing,
        selectedShapeRef,
        shapeRef,
        syncShapeInStorage,
      });
    });

    canvas.on("mouse:up", () => {
      handleCanvasMouseUp({
        canvas,
        isDrawing,
        shapeRef,
        activeObjectRef,
        selectedShapeRef,
        syncShapeInStorage,
        setActiveElement,
      });
    });

    canvas.on("path:created", (options) => {
      handlePathCreated({
        options,
        syncShapeInStorage,
      });
    });

    canvas.on("object:modified", (options) => {
      handleCanvasObjectModified({
        options,
        syncShapeInStorage,
      });
    });

    canvas?.on("object:moving", (options) => {
      handleCanvasObjectMoving({
        options,
      });
    });

    canvas.on("selection:created", (options) => {
      handleCanvasSelectionCreated({
        options,
        isEditingRef,
        setElementAttributes,
      });
    });

    canvas.on("object:scaling", (options) => {
      handleCanvasObjectScaling({
        options,
        setElementAttributes,
      });
    });

    canvas.on("mouse:wheel", (options) => {
      handleCanvasZoom({
        options,
        canvas,
      });
    });

    window.addEventListener("resize", () => {
      handleResize({
        canvas: fabricRef.current,
      });
    });

    window.addEventListener("keydown", (e) =>
      handleKeyDown({
        e,
        canvas: fabricRef.current,
        undo,
        redo,
        syncShapeInStorage,
        deleteShapeFromStorage,
      })
    );

    return () => {
      canvas.dispose();

      window.removeEventListener("resize", () => {
        handleResize({
          canvas: null,
        });
      });

      window.removeEventListener("keydown", (e) =>
        handleKeyDown({
          e,
          canvas: fabricRef.current,
          undo,
          redo,
          syncShapeInStorage,
          deleteShapeFromStorage,
        })
      );
    };
  }, [canvasRef]); // run this effect only once when the component mounts and the canvasRef changes

  // render the canvas when the canvasObjects from live storage changes
  useEffect(() => {
    renderCanvas({
      fabricRef,
      canvasObjects,
      activeObjectRef,
    });
  }, [canvasObjects]);

  return (
    <main className="h-screen overflow-hidden">
      <Navbar
        imageInputRef={imageInputRef}
        activeElement={activeElement}
        handleImageUpload={(e: any) => {
          // prevent the default behavior of the input element
          e.stopPropagation();

          handleImageUpload({
            file: e.target.files[0],
            canvas: fabricRef as any,
            shapeRef,
            syncShapeInStorage,
          });
        }}
        handleActiveElement={handleActiveElement}
      />

      <section className="flex h-full flex-row">
        <LeftSidebar
          allShapes={canvasObjects ? Array.from(canvasObjects) : []}
        />

        <Live canvasRef={canvasRef} />

        <RightSidebar />
      </section>
    </main>
  );
}
