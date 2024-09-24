import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

const Barcode = ({ id }: { id: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      JsBarcode(canvasRef.current, id, {
        format: "CODE128",
        displayValue: false,
        width: 1,
        height: 40,
        margin: 0,
      });
    }
  }, [id]);
  return <canvas className="barcode" ref={canvasRef} />;
};

export default Barcode;
