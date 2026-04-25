import { Box, TextField, Typography, Divider } from '@mui/material'
import { useExamStore } from '@/stores/examStore'

function ExamInfoEditor() {
  const { exam, actions } = useExamStore()
  const { info } = exam

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* 试卷基本信息 */}
      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          试卷基本信息
        </Typography>
        <TextField
          fullWidth
          label="试卷标题"
          value={info.title}
          onChange={(e) => actions.setExamInfo({ title: e.target.value })}
          size="small"
          margin="normal"
        />
        <TextField
          fullWidth
          label="科目"
          value={info.subject}
          onChange={(e) => actions.setExamInfo({ subject: e.target.value })}
          size="small"
          margin="normal"
        />
        <TextField
          fullWidth
          label="考试时间"
          value={info.examTime}
          onChange={(e) => actions.setExamInfo({ examTime: e.target.value })}
          size="small"
          margin="normal"
        />
      </Box>

      <Divider />

      {/* 考生信息 */}
      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          考生信息字段
        </Typography>
        <TextField
          fullWidth
          label="姓名字段"
          value={info.information.name}
          onChange={(e) =>
            actions.setExamInfo({
              information: { ...info.information, name: e.target.value },
            })
          }
          size="small"
          margin="normal"
        />
        <TextField
          fullWidth
          label="班级字段"
          value={info.information.class}
          onChange={(e) =>
            actions.setExamInfo({
              information: { ...info.information, class: e.target.value },
            })
          }
          size="small"
          margin="normal"
        />
        <TextField
          fullWidth
          label="学号字段"
          value={info.information.studentId}
          onChange={(e) =>
            actions.setExamInfo({
              information: { ...info.information, studentId: e.target.value },
            })
          }
          size="small"
          margin="normal"
        />
      </Box>

      <Divider />

      {/* 总分 */}
      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          总分
        </Typography>
        <TextField
          fullWidth
          label="总分"
          type="number"
          value={info.totalPoints}
          onChange={(e) =>
            actions.setExamInfo({ totalPoints: parseInt(e.target.value) || 0 })
          }
          size="small"
          margin="normal"
        />
      </Box>
    </Box>
  )
}

export default ExamInfoEditor
