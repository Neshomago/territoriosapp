import { Modal, ModalContent, ModalBody, Image } from '@heroui/react';

// Modal compartido para ver una foto en grande dentro de la misma app,
// en vez de abrirla en una pestaña/ventana nueva. `imageUrl` nulo/vacío
// mantiene el modal cerrado.
export default function ImagePreviewModal({ imageUrl, onClose }) {
  return (
    <Modal
      placement="center"
      backdrop="blur"
      isOpen={Boolean(imageUrl)}
      onClose={onClose}
      classNames={{
        base: "rounded-3xl shadow-ambient-hover",
      }}
    >
      <ModalContent>
        <ModalBody className="p-6">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Foto"
              className="w-full h-auto rounded-2xl shadow-md border border-surface-container"
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
