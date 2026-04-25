import { Box, Typography, Button, TextField, Grid, Paper } from '@mui/material'
import { Upload as UploadIcon, Image as ImageIcon } from '@mui/icons-material'
import { useState, useRef } from 'react'

interface ImageProcessorProps {
  onImageInsert: (svgContent: string) => void
}

function ImageProcessor({ onImageInsert }: ImageProcessorProps) {
  const [imageData, setImageData] = useState<string | null>(null)
  const [imageName, setImageName] = useState('')
  const [imageWidth, setImageWidth] = useState('3cm')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImageData(result)
        setImageName(file.name.replace(/\.[^/.]+$/, ''))
      }
      reader.readAsDataURL(file)
    }
    event.target.value = ''
  }

  const handleInsertImage = () => {
    if (imageData) {
      const svgContent = `\\includegraphics[width=${imageWidth}]{${imageName}.png}`
      onImageInsert(svgContent)
      setImageData(null)
      setImageName('')
    }
  }

  const handleInsertAsSvg = () => {
    if (imageData) {
      // 将图片转换为 SVG 嵌入
      const svgContent = `\\begin{figure}[h]\n  \\centering\n  \\includegraphics[width=${imageWidth}]{${imageName}.png}\n  \\caption{图片}\n\\end{figure}`
      onImageInsert(svgContent)
      setImageData(null)
      setImageName('')
    }
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        图片处理
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<UploadIcon />}
          onClick={() => fileInputRef.current?.click()}
          fullWidth
        >
          上传图片
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
      </Box>

      {imageData && (
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              mb: 2,
              textAlign: 'center',
              p: 2,
              bgcolor: 'grey.100',
              borderRadius: 1,
            }}
          >
            <img
              src={imageData}
              alt="预览"
              style={{ maxWidth: '100%', maxHeight: 150 }}
            />
          </Box>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={8}>
              <TextField
                fullWidth
                label="图片名称"
                value={imageName}
                onChange={(e) => setImageName(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="宽度"
                value={imageWidth}
                onChange={(e) => setImageWidth(e.target.value)}
                size="small"
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<ImageIcon />}
              onClick={handleInsertImage}
              sx={{ flex: 1 }}
            >
              插入图片
            </Button>
            <Button
              variant="outlined"
              onClick={handleInsertAsSvg}
              sx={{ flex: 1 }}
            >
              插入为 Figure
            </Button>
          </Box>
        </Box>
      )}

      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          提示：图片需要保存到项目目录或使用相对路径。
          建议将图片放入 public/images/ 目录。
        </Typography>
      </Box>
    </Paper>
  )
}

export default ImageProcessor
