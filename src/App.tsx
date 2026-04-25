import { Box, Container, Grid, Paper, Typography } from '@mui/material'
import ExamInfoEditor from './components/ExamInfoEditor'
import QuestionList from './components/QuestionList'
import QuestionEditor from './components/QuestionEditor'
import Toolbar from './components/Toolbar'
import PreviewPanel from './components/PreviewPanel'

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 顶部工具栏 */}
      <Toolbar />
      
      {/* 主内容区 */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        <Container maxWidth="xl" sx={{ py: 2, height: '100%' }}>
          <Grid container spacing={2} sx={{ height: '100%' }}>
            {/* 左侧：题目列表 */}
            <Grid item xs={12} md={2} sx={{ height: '100%' }}>
              <Paper sx={{ p: 2, height: '100%', overflow: 'auto' }}>
                <Typography variant="h6" gutterBottom>
                  题目列表
                </Typography>
                <QuestionList />
              </Paper>
            </Grid>
            
            {/* 中间：题目编辑器 */}
            <Grid item xs={12} md={5} sx={{ height: '100%' }}>
              <Paper sx={{ p: 2, height: '100%', overflow: 'auto' }}>
                <Typography variant="h6" gutterBottom>
                  题目编辑
                </Typography>
                <QuestionEditor />
              </Paper>
            </Grid>
            
            {/* 右侧：试卷信息和预览 */}
            <Grid item xs={12} md={5} sx={{ height: '100%' }}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* 试卷信息 */}
                <Paper sx={{ p: 2, flex: 1, overflow: 'auto' }}>
                  <Typography variant="h6" gutterBottom>
                    试卷信息
                  </Typography>
                  <ExamInfoEditor />
                </Paper>
                
                {/* 预览面板 */}
                <Box sx={{ flex: 1 }}>
                  <PreviewPanel />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default App
