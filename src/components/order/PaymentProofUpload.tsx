"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileCheck } from "lucide-react";
import { toast } from "sonner";
import { useUploadPaymentProof } from "@/src/lib/hooks/useOrders";
import { useRouter } from "next/navigation";

interface PaymentProofUploadProps {
  orderId: string;
  paymentMethod:
    | "TRANSFERENCIA"
    | "PAGO_MOVIL"
    | "ZELLE"
    | "EFECTIVO"
    | "MERCADO_PAGO";
  total: number;
}

interface TransferenciaData {
  bank: string;
  accountType: string;
  accountNumber: string;
  dni: string;
  name: string;
}

interface PagoMovilData {
  bank: string;
  phone: string;
  dni: string;
  name: string;
}

interface ZelleData {
  email: string;
  name: string;
}

const BANK_DATA: {
  TRANSFERENCIA: TransferenciaData;
  PAGO_MOVIL: PagoMovilData;
  ZELLE: ZelleData;
} = {
  TRANSFERENCIA: {
    bank: "Bancamiga (0172)",
    accountType: "Cuenta Corriente Amiga",
    accountNumber: "0172-0131-04-1315504900",
    dni: "V-17.141.349",
    name: "José Rafael Pérez Muñoz",
  },
  PAGO_MOVIL: {
    bank: "Bancamiga (0172)",
    phone: "0412-368-9263",
    dni: "V-17.141.349",
    name: "Del Carajo",
  },
  ZELLE: {
    email: "pagos@esdelcarajo.com",
    name: "Del Carajo Store",
  },
};

export function PaymentProofUpload({
  orderId,
  paymentMethod,
  total,
}: PaymentProofUploadProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const uploadProof = useUploadPaymentProof();

  if (paymentMethod === "EFECTIVO" || paymentMethod === "MERCADO_PAGO") {
    return null;
  }

  const bankData = BANK_DATA[paymentMethod];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("El archivo no puede pesar más de 5MB");
        return;
      }
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("Solo se permiten imágenes");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Selecciona un comprobante");
      return;
    }

    try {
      await uploadProof.mutateAsync({ orderId, file });
      toast.success("Comprobante enviado exitosamente");
      toast.info("Tu pedido será procesado una vez confirmemos el pago");
      router.push("/");
    } catch (error) {
      toast.error("Error al subir el comprobante");
      console.error(error);
    }
  };

  return (
    <div className="border-2 border-primary rounded-lg p-6 bg-primary/5">
      <h3 className="text-2xl font-bold mb-4">Completa tu Pago</h3>

      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6 border-2 border-dark">
          <h4 className="font-bold text-lg mb-4">
            Datos para{" "}
            {paymentMethod === "TRANSFERENCIA"
              ? "Transferencia"
              : paymentMethod === "PAGO_MOVIL"
              ? "Pago Móvil"
              : "Zelle"}
          </h4>

          {paymentMethod === "TRANSFERENCIA" && (
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-bold">Banco:</span>{" "}
                {(bankData as TransferenciaData).bank}
              </p>
              <p>
                <span className="font-bold">Tipo:</span>{" "}
                {(bankData as TransferenciaData).accountType}
              </p>
              <p>
                <span className="font-bold">Número:</span>{" "}
                {(bankData as TransferenciaData).accountNumber}
              </p>
              <p>
                <span className="font-bold">Cédula:</span>{" "}
                {(bankData as TransferenciaData).dni}
              </p>
              <p>
                <span className="font-bold">Titular:</span>{" "}
                {(bankData as TransferenciaData).name}
              </p>
            </div>
          )}

          {paymentMethod === "PAGO_MOVIL" && (
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-bold">Banco:</span>{" "}
                {(bankData as PagoMovilData).bank}
              </p>
              <p>
                <span className="font-bold">Teléfono:</span>{" "}
                {(bankData as PagoMovilData).phone}
              </p>
              <p>
                <span className="font-bold">Cédula:</span>{" "}
                {(bankData as PagoMovilData).dni}
              </p>
              <p>
                <span className="font-bold">Titular:</span>{" "}
                {(bankData as PagoMovilData).name}
              </p>
            </div>
          )}

          {paymentMethod === "ZELLE" && (
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-bold">Email:</span>{" "}
                {(bankData as ZelleData).email}
              </p>
              <p>
                <span className="font-bold">Nombre:</span>{" "}
                {(bankData as ZelleData).name}
              </p>
            </div>
          )}

          <div className="mt-4 pt-4 border-t-2 border-dark">
            <p className="font-bold text-xl">
              Monto a pagar: $ {total.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border-2 border-dark">
          <h4 className="font-bold text-lg mb-4">Sube tu Comprobante</h4>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="proof-upload"
              />
              <label
                htmlFor="proof-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                {file ? (
                  <>
                    <FileCheck className="h-12 w-12 text-green-500" />
                    <p className="font-bold">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(0)} KB
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-gray-400" />
                    <p className="font-bold">Haz clic para seleccionar</p>
                    <p className="text-sm text-muted-foreground">
                      Imagen PNG, JPG (máx. 5MB)
                    </p>
                  </>
                )}
              </label>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={handleUpload}
              disabled={!file || uploadProof.isPending}
            >
              {uploadProof.isPending ? "Enviando..." : "Enviar Comprobante"}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Una vez enviado el comprobante, verificaremos tu pago y
              procesaremos tu pedido
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
