import { Box, TextField, Typography, Divider, IconButton, Button, Grid } from '@mui/material'
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material'
import { useExamStore } from '@/stores/examStore'

function ExamInfoEditor() {
  const { exam, actions } = useExamStore()
  const { info } = exam

  const updateField = (key: string, updates: Partial<{ label: string; width: number }>) => {
    const newFields = info.information.fields.map((f) =>
      f.key === key ? { ...f, ...updates } : f
    )
    actions.setExamInfo({ information: { fields: newFields } })
  }

  const deleteField = (key: string) => {
    const newFields = info.information.fields.filter((f) => f.key !== key)
    actions.setExamInfo({ information: { fields: newFields } })
  }

  const addField = () => {
    const newKey = `field_${Date.now()}`
    const newFields = [...info.information.fields, { key: newKey, label: '新字段', width: 4 }]
    actions.setExamInfo({ information: { fields: newFields } })
  }

  const fields = info.information?.fields || []

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
          value={info.title || ''}
          onChange={(e) => actions.setExamInfo({ title: e.target.value })}
          size="small"
          margin="normal"
        />
        <TextField
          fullWidth
          label="科目"
          value={info.subject || ''}
          onChange={(e) => actions.setExamInfo({ subject: e.target.value })}
          size="small"
          margin="normal"
        />
        <TextField
          fullWidth
          label="考试时间"
          value={info.examTime || ''}
          onChange={(e) => actions.setExamInfo({ examTime: e.target.value })}
          size="small"
          margin="normal"
        />
      </Box>

      <Divider />

      {/* 考生信息 */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            考生信息字段
          </Typography>
          <Button size="small" startIcon={<AddIcon />} onClick={addField}>
            添加字段
          </Button>
        </Box>
        {fields.map((field) => (
          <Grid container spacing={1} key={field.key} sx={{ mb: 1, alignItems: 'center' }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="字段名"
                value={field.label}
                onChange={(e) => updateField(field.key, { label: e.target.value })}
                size="small"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="下划线宽度"
                type="number"
                value={field.width || 4}
                onChange={(e) => updateField(field.key, { width: parseInt(e.target.value) || 4 })}
                size="small"
                inputProps={{ min: 2, max: 12 }}
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton
                size="small"
                onClick={() => deleteField(field.key)}
                disabled={fields.length <= 1}
              >
                <RemoveIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
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
