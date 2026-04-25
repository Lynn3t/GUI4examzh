import { Box, TextField, Typography, Paper, Grid, Button } from '@mui/material'
import { useState } from 'react'

interface FormulaEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

function FormulaEditor({ value, onChange, label = '公式编辑器' }: FormulaEditorProps) {
  const [preview, setPreview] = useState(false)

  const formulaButtons = [
    { label: '分数', latex: '\\frac{a}{b}' },
    { label: '平方', latex: 'x^2' },
    { label: '根号', latex: '\\sqrt{x}' },
    { label: '求和', latex: '\\sum_{i=1}^{n}' },
    { label: '积分', latex: '\\int_{a}^{b}' },
    { label: '希腊字母 α', latex: '\\alpha' },
    { label: '希腊字母 β', latex: '\\beta' },
    { label: '希腊字母 π', latex: '\\pi' },
    { label: '大于等于', latex: '\\geq' },
    { label: '小于等于', latex: '\\leq' },
  ]

  const insertFormula = (latex: string) => {
    onChange(value + latex)
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>
      
      <TextField
        fullWidth
        multiline
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="输入 LaTeX 公式..."
        size="small"
        sx={{ mb: 2 }}
      />

      <Typography variant="caption" color="text.secondary" gutterBottom>
        快速插入：
      </Typography>
      
      <Grid container spacing={1} sx={{ mb: 2 }}>
        {formulaButtons.map((btn, index) => (
          <Grid item key={index}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => insertFormula(btn.latex)}
              sx={{ minWidth: 'auto', px: 1 }}
            >
              {btn.label}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          提示：公式编辑器功能暂未完全实现，当前仅支持 LaTeX 代码输入。
          导出后使用 xelatex 编译查看效果。
        </Typography>
      </Box>
    </Paper>
  )
}

export default FormulaEditor
