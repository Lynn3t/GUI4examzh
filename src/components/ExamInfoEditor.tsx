import { Accordion, AccordionDetails, AccordionSummary, Box, TextField, Typography, Divider, IconButton, Button, Grid, Switch, FormControlLabel, MenuItem } from '@mui/material'
import { Add as AddIcon, Remove as RemoveIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material'
import { useExamStore } from '@/stores/examStore'
import type { ExamSetupExtraGroups } from '@/types/exam'

const extraGroupPanels: Array<{ key: keyof ExamSetupExtraGroups; title: string; description: string }> = [
  { key: '风格设置', title: '风格设置', description: '用于填写句号映射、脚注样式等风格参数。' },
  { key: '师生两版', title: '师生两版', description: '用于填写双版本输出相关参数。' },
  { key: '数学符号', title: '数学符号', description: '用于填写中国化数学符号与分式样式参数。' },
  { key: '页面补充', title: '页面', description: '用于填写页眉、页脚类型、中缝线、章节显示等页面补充参数。' },
  { key: '密封线', title: '密封线', description: '用于填写密封线、侧边文字、圆点等参数。' },
  { key: '方格', title: '方格', description: '用于填写方格尺寸、线宽、偏移等参数。' },
  { key: '字体', title: '字体', description: '用于填写中文、西文、数学字体相关参数。' },
  { key: '抬头补充', title: '抬头', description: '用于填写标题上下间距等抬头补充参数。' },
  { key: '题干补充', title: '题干', description: '用于填写题号、题干缩进、填空接入等参数。' },
  { key: '选择题补充', title: '选择题', description: '用于填写选项列数、标签样式、间距等补充参数。' },
  { key: '填空题', title: '填空题', description: '用于填写填空线型、占位方式、颜色、宽度等参数。' },
  { key: '解答题补充', title: '解答题', description: '用于填写解答标签、结尾符、得分格式等补充参数。' },
  { key: '列表环境', title: '列表环境', description: '用于填写步骤、方法、情形环境参数。' },
  { key: '草稿纸', title: '草稿纸', description: '用于填写草稿纸样式与自动附加参数。' },
  { key: '评分框', title: '评分框', description: '用于填写评分框外观与内容参数。' },
  { key: '选择标记', title: '选择标记', description: '用于填写选择标记题型的显示参数。' },
  { key: '连线题', title: '连线题', description: '用于填写连线题两列距离、名称等参数。' },
  { key: '语文相关', title: '语文相关', description: '用于填写材料、古诗、作文框等参数。' },
  { key: '图文排版', title: '图文排版', description: '用于填写图文混排、多图排版、环绕排版参数。' },
  { key: '计算题排版', title: '计算题排版', description: '用于填写计算题环境列数、间距等参数。' },
  { key: '其他参数', title: '其他参数', description: '用于填写暂未归类但需要原样并入的模板参数。' },
]

function ExamInfoEditor() {
  const { exam, actions } = useExamStore()
  const { info, examSetup } = exam

  const solutionPreAnalysis = (examSetup.solution?.preAnalysis || []).join('\n')
  const extraGroups = examSetup.extraGroups || {}

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

  const updateExtraGroup = (key: keyof ExamSetupExtraGroups, value: string) => {
    actions.setExamSetup({ extraGroups: { [key]: value } })
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
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>模板参数配置</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          常用参数可直接设置；其余参数按分组填写，会原样并入模板参数命令。
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="纸张大小"
              helperText="A4 为单页，A3 为双页拼接"
              value={examSetup.page?.size || 'a4paper'}
              onChange={(e) => actions.setExamSetup({ page: { size: e.target.value } })}
              size="small"
            >
              <MenuItem value="a4paper">A4 纸</MenuItem>
              <MenuItem value="a3paper">A3 纸</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="页脚内容"
              helperText="用于控制页脚显示文字"
              value={examSetup.page?.footContent || ''}
              onChange={(e) => actions.setExamSetup({ page: { footContent: e.target.value } })}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}><FormControlLabel control={<Switch checked={Boolean(examSetup.page?.showHead)} onChange={(e) => actions.setExamSetup({ page: { showHead: e.target.checked } })} />} label="显示页眉" /></Grid>
          <Grid item xs={12} md={6}><FormControlLabel control={<Switch checked={Boolean(examSetup.page?.showFoot)} onChange={(e) => actions.setExamSetup({ page: { showFoot: e.target.checked } })} />} label="显示页脚" /></Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="标题格式"
              helperText="填写标题格式命令"
              value={examSetup.title?.titleFormat || ''}
              onChange={(e) => actions.setExamSetup({ title: { titleFormat: e.target.value } })}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="科目格式"
              helperText="填写科目格式命令"
              value={examSetup.title?.subjectFormat || ''}
              onChange={(e) => actions.setExamSetup({ title: { subjectFormat: e.target.value } })}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="分值显示方式"
              helperText="控制题干处是否显示分值"
              value={examSetup.question?.showPoints || 'auto'}
              onChange={(e) => actions.setExamSetup({ question: { showPoints: e.target.value } })}
              size="small"
            >
              <MenuItem value="auto">自动</MenuItem>
              <MenuItem value="true">全部显示</MenuItem>
              <MenuItem value="false">全部隐藏</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="选项标签间距"
              helperText="填写选项标签和内容之间的间距"
              value={examSetup.choices?.labelSep || ''}
              onChange={(e) => actions.setExamSetup({ choices: { labelSep: e.target.value } })}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}><FormControlLabel control={<Switch checked={Boolean(examSetup.paren?.showParen)} onChange={(e) => actions.setExamSetup({ paren: { showParen: e.target.checked } })} />} label="显示括号" /></Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="括号位置方式"
              helperText="控制括号是否自动排到行尾"
              value={examSetup.paren?.type || 'hfill'}
              onChange={(e) => actions.setExamSetup({ paren: { type: e.target.value } })}
              size="small"
            >
              <MenuItem value="hfill">自动贴到行尾</MenuItem>
              <MenuItem value="none">紧跟题干</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="解析显示方式"
              helperText="控制解析隐藏、原地显示或移到文末"
              value={examSetup.solution?.showSolution || 'show-move'}
              onChange={(e) => actions.setExamSetup({ solution: { showSolution: e.target.value } })}
              size="small"
            >
              <MenuItem value="hide">隐藏解析</MenuItem>
              <MenuItem value="show-stay">原位置显示</MenuItem>
              <MenuItem value="show-move">移到文末</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="解析前置文字"
              helperText="解析移到文末时显示在前面的内容，每行一项"
              value={solutionPreAnalysis}
              onChange={(e) => actions.setExamSetup({ solution: { preAnalysis: e.target.value.split('\n') } })}
              size="small"
              multiline
              minRows={2}
            />
          </Grid>
          <Grid item xs={12} md={6}><FormControlLabel control={<Switch checked={Boolean(examSetup.solution?.scoreShowleader)} onChange={(e) => actions.setExamSetup({ solution: { scoreShowleader: e.target.checked } })} />} label="显示得分引导线" /></Grid>
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {extraGroupPanels.map((panel) => (
            <Accordion key={panel.key} disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box>
                  <Typography variant="subtitle2">{panel.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{panel.description}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label={`${panel.title}参数`}
                  helperText="支持多行填写；保存后会原样并入模板参数命令。"
                  value={extraGroups[panel.key] || ''}
                  onChange={(e) => updateExtraGroup(panel.key, e.target.value)}
                  size="small"
                />
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default ExamInfoEditor
