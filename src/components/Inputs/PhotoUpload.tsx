import { Box, IconButton } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

type PhotoUploadProps = {
  value?: File | string | null;
  onChange?: (file: File | null) => void;
};

export default function PhotoUpload({ value, onChange }: PhotoUploadProps) {
  const [image, setImage] = useState<File | null>(typeof value === "string" ? null : value || null);
  const [imageUrl, setImageUrl] = useState<string | null>(typeof value === "string" ? value : null);

  // Função para normalizar a URL da imagem
  const normalizeImageUrl = (url: string | null): string | null => {
    if (!url) return null;
    
    // Se já for uma URL completa ou blob
    if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) {
      return url;
    }
    
    // Se começar com /, já está no formato correto
    if (url.startsWith('/')) {
      return url;
    }
    
    // Se for apenas um nome de arquivo, adiciona /uploads/
    return `/uploads/${url}`;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(file);
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);
      onChange?.(file);
    }
  };

  const handleRemove = () => {
    // Limpa URL de objeto se existir
    if (imageUrl && imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl);
    }
    setImage(null);
    setImageUrl(null);
    onChange?.(null);
  };

  useEffect(() => {
    // Limpa URLs de objetos quando componente desmontar
    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  useEffect(() => {
    if (typeof value === "string") {
      // Se for string, é uma URL da foto existente
      setImage(null);
      // Normaliza a URL antes de salvar
      setImageUrl(normalizeImageUrl(value));
    } else if (value instanceof File) {
      // Se for File, é uma nova foto selecionada
      setImage(value);
      const objectUrl = URL.createObjectURL(value);
      setImageUrl(objectUrl);
    } else {
      // Se for null ou undefined, limpa tudo
      setImage(null);
      setImageUrl(null);
    }
  }, [value]);

  const hasPhoto = !!imageUrl;

  // Função para obter a URL segura para o componente Image
  const getSafeImageSrc = (): string => {
    if (!imageUrl) return '';
    
    // Para blob URLs ou URLs completas, usa diretamente
    if (imageUrl.startsWith('blob:') || imageUrl.startsWith('http') || imageUrl.startsWith('data:')) {
      return imageUrl;
    }
    
    // Para caminhos relativos, verifica se começa com /
    if (!imageUrl.startsWith('/')) {
      return `/${imageUrl}`;
    }
    
    return imageUrl;
  };

  // Função para verificar se podemos usar o componente Image do Next.js
  const canUseNextImage = (): boolean => {
    const src = getSafeImageSrc();
    
    if (!src) return false;
    
    try {
      // Verifica se é uma URL válida para o Next.js Image
      if (src.startsWith('/')) {
        return true; // Caminho relativo é válido
      }
      if (src.startsWith('blob:') || src.startsWith('data:')) {
        return true; // Blob URLs são válidas
      }
      if (src.startsWith('http')) {
        // Tenta criar uma URL para verificar se é válida
        new URL(src);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const safeImageSrc = getSafeImageSrc();
  const shouldUseNextImage = canUseNextImage();

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
        cursor: hasPhoto ? 'pointer' : 'default',
        overflow: 'hidden',
        position: 'relative',
        '&:hover': {
          '& .overlay': {
            opacity: hasPhoto ? 1 : 0,
          }
        }
      }}
    >
      {hasPhoto && safeImageSrc ? (
        <>
          {/* Usa Next.js Image se possível, senão usa img nativo */}
          {shouldUseNextImage ? (
            <Image
              src={safeImageSrc}
              alt="Foto do perfil"
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              style={{ objectFit: 'cover' }}
              priority={false}
              onError={(e) => {
                console.error('Erro ao carregar imagem com Next.js Image:', safeImageSrc);
                // Fallback para img nativo
                const imgElement = document.createElement('img');
                imgElement.src = safeImageSrc;
                imgElement.style.width = '100%';
                imgElement.style.height = '100%';
                imgElement.style.objectFit = 'cover';
                imgElement.style.position = 'absolute';
                imgElement.style.top = '0';
                imgElement.style.left = '0';
                e.currentTarget.parentNode?.appendChild(imgElement);
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            // Fallback para img nativo
            <img
              src={safeImageSrc}
              alt="Foto do perfil"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
              onError={(e) => {
                console.error('Erro ao carregar imagem com img nativo:', safeImageSrc);
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          
          {/* Overlay para indicar que pode trocar a foto */}
          <Box
            className="overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 0,
              transition: 'opacity 0.3s',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'medium',
              pointerEvents: 'none',
            }}
          >
            Clique para trocar a foto
          </Box>

          {/* Botão para remover a imagem */}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            sx={{
              position: 'absolute',
              top: 5,
              right: 5,
              bgcolor: 'rgba(255,255,255,0.7)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
              zIndex: 10,
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Input file invisível que cobre toda a área */}
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            id="photo-upload-input"
            onChange={handleFileChange}
          />
          <label 
            htmlFor="photo-upload-input" 
            style={{ 
              position: 'absolute', 
              width: '100%', 
              height: '100%', 
              cursor: 'pointer',
              zIndex: 5,
            }} 
          />
        </>
      ) : (
        <>
          <IconButton 
            component="label"
            sx={{ zIndex: 1 }}
          >
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
            <AddPhotoAlternateIcon sx={{ color: "#555555", fontSize: 40 }} />
          </IconButton>
        </>
      )}
    </Box>
  );
}