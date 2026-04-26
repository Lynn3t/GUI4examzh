import { Box, Container, Paper, Typography, Button, Tabs, Tab } from '@mui/material'
import { ArrowBack as ArrowBackIcon, FileCopy as CopyIcon } from '@mui/icons-material'
import { useState } from 'react'
import { useExamStore } from '@/stores/examStore'
import { generateLatex } from '@/utils/latexGenerator'
import { calculateTotalPoints, getQuestionContents } from '@/types/exam'

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

interface PreviewPageProps {
  onBack: () => void
}

function PreviewPage({ onBack }: PreviewPageProps) {
  const { exam } = useExamStore()
  const [tabValue, setTabValue] = useState(0)

  const latexCode = generateLatex(exam)
  const questionCount = getQuestionContents(exam).length
  const totalPoints = calculateTotalPoints(exam)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(latexCode)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 顶部工具栏 */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          variant="outlined"
        >
          返回编辑
        </Button>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          预览 & 导出
        </Typography>
        <Button
          variant="contained"
          startIcon={<CopyIcon />}
          onClick={handleCopyLatex}
          sx={{ bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}
        >
          复制 LaTeX
        </Button>
      </Paper>

      {/* 主内容区 */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        <Container maxWidth="xl" sx={{ py: 2, height: '100%' }}>
          <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* 标签页 */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="LaTeX 代码" {...a11yProps(0)} />
                <Tab label="渲染预览" {...a11yProps(1)} />
                <Tab label="试卷信息" {...a11yProps(2)} />
              </Tabs>
            </Box>

            {/* LaTeX 代码标签页 */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ position: 'relative', flex: 1, overflow: 'auto' }}>
                <pre
                  style={{
                    backgroundColor: '#f5f5f5',
                    padding: '16px',
                    borderRadius: '4px',
                    overflow: 'auto',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                  }}
                >
                  {latexCode}
                </pre>
              </Box>
            </TabPanel>

            {/* 渲染预览标签页 */}
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

            {/* 试卷信息标签页 */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    试卷标题
                  </Typography>
                  <Typography variant="body1">{exam.info.title}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    科目
                  </Typography>
                  <Typography variant="body1">{exam.info.subject || '未设置'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    考试时间
                  </Typography>
                  <Typography variant="body1">{exam.info.examTime || '未设置'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    总分
                  </Typography>
                  <Typography variant="body1">{totalPoints} 分</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    题目数量
                  </Typography>
                  <Typography variant="body1">{questionCount} 题</Typography>
                </Box>
              </Box>
            </TabPanel>
          </Paper>
        </Container>
      </Box>
    </Box>
  )
}

export default PreviewPage
