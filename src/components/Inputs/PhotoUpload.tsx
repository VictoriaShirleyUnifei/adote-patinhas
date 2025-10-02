import { Box, IconButton } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

type PhotoUploadProps = {
  value?: File | null;
  onChange?: (file: File | null) => void;
};

export default function PhotoUpload({ value, onChange }: PhotoUploadProps) {
  const [image, setImage] = useState<File | null>(value || null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(file);
      onChange?.(file);
    }
  };

  const handleRemove = () => {
    setImage(null);
    onChange?.(null);
  };

  useEffect(() => {
    setImage(value || null);
  }, [value]);

  return (
    <Box
      sx={{
        width: '100%',
        height: 230,
        bgcolor: '#D9D9D9',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {image ? (
        <>
          <Image
            src={URL.createObjectURL(image)}
            alt="animal"
            fill
            style={{ objectFit: 'cover' }}
          />
          {/* Botão para remover ou trocar a imagem */}
          <IconButton
            onClick={handleRemove}
            sx={{
              position: 'absolute',
              top: 5,
              right: 5,
              bgcolor: 'rgba(255,255,255,0.7)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
            }}
          >
            <CloseIcon />
          </IconButton>
          {/* Mantém input invisível para trocar a foto */}
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            id="photo-upload-input"
            onChange={handleFileChange}
          />
          <label htmlFor="photo-upload-input" style={{ position: 'absolute', width: '100%', height: '100%', cursor: 'pointer' }} />
        </>
      ) : (
        <IconButton component="label">
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
          <AddPhotoAlternateIcon sx={{ color: "#555555", fontSize: 40 }} />
        </IconButton>
      )}
    </Box>
  );
}
