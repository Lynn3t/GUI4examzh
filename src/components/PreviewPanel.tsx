import { Box, Tabs, Tab, Typography, Paper, Button } from '@mui/material'
import { useState } from 'react'
import { useExamStore } from '@/stores/examStore'
import { generateLatex } from '@/utils/latexGenerator'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`preview-tabpanel-${index}`}
      aria-labelledby={`preview-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `preview-tab-${index}`,
    'aria-controls': `preview-tabpanel-${index}`,
  }
}

function PreviewPanel() {
  const { exam } = useExamStore()
  const [tabValue, setTabValue] = useState(0)

  const latexCode = generateLatex(exam)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(latexCode)
  }

  return (
    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        预览
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="LaTeX 代码" {...a11yProps(0)} />
          <Tab label="渲染预览" {...a11yProps(1)} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ position: 'relative' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleCopyLatex}
            sx={{ position: 'absolute', top: 0, right: 0 }}
          >
            复制
          </Button>
          <pre
            style={{
              backgroundColor: '#f5f5f5',
              padding: '16px',
              borderRadius: '4px',
              overflow: 'auto',
              maxHeight: '400px',
              fontSize: '14px',
              fontFamily: 'monospace',
              marginTop: '32px',
            }}
          >
            {latexCode}
          </pre>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ minHeight: '200px', textAlign: 'center', color: 'text.secondary' }}>
          <Typography>
            渲染预览功能需要集成 KaTeX
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            导出 .tex 文件后，使用 xelatex 编译查看效果
          </Typography>
        </Box>
      </TabPanel>
    </Paper>
  )
}

export default PreviewPanel
