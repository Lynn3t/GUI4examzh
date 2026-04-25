import { Box, TextField, Typography, Paper, Grid, Button } from '@mui/material'

interface FormulaEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

function FormulaEditor({ value, onChange, label = '公式编辑器' }: FormulaEditorProps) {

  const formulaButtons = [
    // 基本运算
    { label: '分数', latex: '\\frac{a}{b}' },
    { label: '平方', latex: 'x^2' },
    { label: '立方', latex: 'x^3' },
    { label: 'n次方', latex: 'x^n' },
    { label: '根号', latex: '\\sqrt{x}' },
    { label: 'n次根号', latex: '\\sqrt[n]{x}' },
    
    // 求和与积分
    { label: '求和', latex: '\\sum_{i=1}^{n}' },
    { label: '求积', latex: '\\prod_{i=1}^{n}' },
    { label: '积分', latex: '\\int_{a}^{b}' },
    { label: '定积分', latex: '\\int_{a}^{b} f(x)dx' },
    { label: '极限', latex: '\\lim_{x \\to \\infty}' },
    
    // 希腊字母
    { label: 'α', latex: '\\alpha' },
    { label: 'β', latex: '\\beta' },
    { label: 'γ', latex: '\\gamma' },
    { label: 'δ', latex: '\\delta' },
    { label: 'θ', latex: '\\theta' },
    { label: 'π', latex: '\\pi' },
    { label: 'Σ', latex: '\\Sigma' },
    { label: 'Ω', latex: '\\Omega' },
    
    // 关系符号
    { label: '≥', latex: '\\geq' },
    { label: '≤', latex: '\\leq' },
    { label: '≠', latex: '\\neq' },
    { label: '≈', latex: '\\approx' },
    { label: '≡', latex: '\\equiv' },
    { label: '∈', latex: '\\in' },
    { label: '∉', latex: '\\notin' },
    { label: '⊂', latex: '\\subset' },
    { label: '⊃', latex: '\\supset' },
    { label: '∩', latex: '\\cap' },
    { label: '∪', latex: '\\cup' },
    
    // 几何符号
    { label: '△', latex: '\\triangle' },
    { label: '⊥', latex: '\\perp' },
    { label: '∥', latex: '\\parallel' },
    { label: '∠', latex: '\\angle' },
    { label: '°', latex: '^\\circ' },
    
    // 其他
    { label: '向量', latex: '\\vec{v}' },
    { label: '点乘', latex: '\\cdot' },
    { label: '无穷', latex: '\\infty' },
    { label: '空集', latex: '\\emptyset' },
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
      
      <Box sx={{ maxHeight: 200, overflow: 'auto', mb: 2 }}>
        <Grid container spacing={1}>
          {formulaButtons.map((btn, index) => (
            <Grid item key={index}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => insertFormula(btn.latex)}
                sx={{ minWidth: 'auto', px: 1, fontSize: '0.75rem' }}
              >
                {btn.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

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
