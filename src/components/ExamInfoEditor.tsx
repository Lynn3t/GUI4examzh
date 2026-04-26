import { Box, TextField, Typography, Divider, IconButton, Button, Grid, Switch, FormControlLabel } from '@mui/material'
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material'
import { useExamStore } from '@/stores/examStore'

function ExamInfoEditor() {
  const { exam, actions } = useExamStore()
  const { info, examSetup } = exam

  const updateField = (key: string, updates: Partial<{ label: string; width: number }>) => {
    actions.setExamInfo({ information: { fields: info.information.fields.map((field) => field.key === key ? { ...field, ...updates } : field) } })
  }

  const addField = () => {
    const newKey = `field_${Date.now()}`
    actions.setExamInfo({ information: { fields: [...info.information.fields, { key: newKey, label: '新字段', width: 4 }] } })
  }

  const deleteField = (key: string) => {
    actions.setExamInfo({ information: { fields: info.information.fields.filter((field) => field.key !== key) } })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>试卷基本信息</Typography>
        <TextField fullWidth label="试卷标题" value={info.title || ''} onChange={(e) => actions.setExamInfo({ title: e.target.value })} size="small" margin="normal" />
        <TextField fullWidth label="科目" value={info.subject || ''} onChange={(e) => actions.setExamInfo({ subject: e.target.value })} size="small" margin="normal" />
        <TextField fullWidth label="考试时间" value={info.examTime || ''} onChange={(e) => actions.setExamInfo({ examTime: e.target.value })} size="small" margin="normal" />
      </Box>

      <Divider />

      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">考生信息字段</Typography>
          <Button size="small" startIcon={<AddIcon />} onClick={addField}>添加字段</Button>
        </Box>
        {info.information.fields.map((field) => (
          <Grid container spacing={1} key={field.key} sx={{ mb: 1, alignItems: 'center' }}>
            <Grid item xs={6}><TextField fullWidth label="字段名" value={field.label} onChange={(e) => updateField(field.key, { label: e.target.value })} size="small" /></Grid>
            <Grid item xs={4}><TextField fullWidth label="下划线宽度" type="number" value={field.width || 4} onChange={(e) => updateField(field.key, { width: parseInt(e.target.value, 10) || 4 })} size="small" inputProps={{ min: 2, max: 12 }} /></Grid>
            <Grid item xs={2}><IconButton size="small" onClick={() => deleteField(field.key)} disabled={info.information.fields.length <= 1}><RemoveIcon /></IconButton></Grid>
          </Grid>
        ))}
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>总分</Typography>
        <TextField fullWidth label="总分（自动计算）" value={info.totalPoints} size="small" margin="normal" InputProps={{ readOnly: true }} />
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>`examsetup` 配置</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}><TextField fullWidth label="page.size" value={examSetup.page?.size || ''} onChange={(e) => actions.setExamSetup({ page: { size: e.target.value } })} size="small" /></Grid>
          <Grid item xs={12} md={6}><TextField fullWidth label="page.foot-content" value={examSetup.page?.footContent || ''} onChange={(e) => actions.setExamSetup({ page: { footContent: e.target.value } })} size="small" /></Grid>
          <Grid item xs={12} md={6}><FormControlLabel control={<Switch checked={Boolean(examSetup.page?.showHead)} onChange={(e) => actions.setExamSetup({ page: { showHead: e.target.checked } })} />} label="page.show-head" /></Grid>
          <Grid item xs={12} md={6}><FormControlLabel control={<Switch checked={Boolean(examSetup.page?.showFoot)} onChange={(e) => actions.setExamSetup({ page: { showFoot: e.target.checked } })} />} label="page.show-foot" /></Grid>
          <Grid item xs={12} md={6}><TextField fullWidth label="title.title-format" value={examSetup.title?.titleFormat || ''} onChange={(e) => actions.setExamSetup({ title: { titleFormat: e.target.value } })} size="small" /></Grid>
          <Grid item xs={12} md={6}><TextField fullWidth label="title.subject-format" value={examSetup.title?.subjectFormat || ''} onChange={(e) => actions.setExamSetup({ title: { subjectFormat: e.target.value } })} size="small" /></Grid>
          <Grid item xs={12} md={6}><TextField fullWidth label="question.show-points" value={examSetup.question?.showPoints || ''} onChange={(e) => actions.setExamSetup({ question: { showPoints: e.target.value } })} size="small" /></Grid>
          <Grid item xs={12} md={6}><TextField fullWidth label="choices.label-sep" value={examSetup.choices?.labelSep || ''} onChange={(e) => actions.setExamSetup({ choices: { labelSep: e.target.value } })} size="small" /></Grid>
          <Grid item xs={12} md={6}><FormControlLabel control={<Switch checked={Boolean(examSetup.paren?.showParen)} onChange={(e) => actions.setExamSetup({ paren: { showParen: e.target.checked } })} />} label="paren.show-paren" /></Grid>
          <Grid item xs={12} md={6}><TextField fullWidth label="paren.type" value={examSetup.paren?.type || ''} onChange={(e) => actions.setExamSetup({ paren: { type: e.target.value } })} size="small" /></Grid>
          <Grid item xs={12} md={6}><TextField fullWidth label="solution.show-solution" value={examSetup.solution?.showSolution || ''} onChange={(e) => actions.setExamSetup({ solution: { showSolution: e.target.value } })} size="small" /></Grid>
          <Grid item xs={12} md={6}><TextField fullWidth label="solution.pre-analysis" value={(examSetup.solution?.preAnalysis || []).join('\n')} onChange={(e) => actions.setExamSetup({ solution: { preAnalysis: e.target.value.split('\n') } })} size="small" multiline minRows={2} /></Grid>
          <Grid item xs={12} md={6}><FormControlLabel control={<Switch checked={Boolean(examSetup.solution?.scoreShowleader)} onChange={(e) => actions.setExamSetup({ solution: { scoreShowleader: e.target.checked } })} />} label="solution.score-showleader" /></Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default ExamInfoEditor
