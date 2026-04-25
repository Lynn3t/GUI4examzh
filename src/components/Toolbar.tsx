import { AppBar, Toolbar as MuiToolbar, Typography, Button, Box } from '@mui/material'
import { Save as SaveIcon, Download as DownloadIcon, Upload as UploadIcon } from '@mui/icons-material'

function Toolbar() {
  const handleSave = () => {
    console.log('保存')
  }

  const handleExport = () => {
    console.log('导出')
  }

  const handleImport = () => {
    console.log('导入')
  }

  return (
    <AppBar position="static" color="default" elevation={1}>
      <MuiToolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          exam-zh 网页版编辑器
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={handleImport}
          >
            导入
          </Button>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            保存
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            sx={{ bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}
          >
            导出
          </Button>
        </Box>
      </MuiToolbar>
    </AppBar>
  )
}

export default Toolbar
