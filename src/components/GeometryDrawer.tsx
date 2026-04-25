import { Box, Typography, Button, ButtonGroup, Paper, IconButton, TextField, Grid } from '@mui/material'
import { 
  Straighten as LineIcon, 
  Circle as CircleIcon, 
  ChangeHistory as TriangleIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Clear as ClearIcon,
  GridOn as GridIcon,
} from '@mui/icons-material'
import { useState, useRef, useEffect } from 'react'

interface Point {
  x: number
  y: number
  label?: string
}

interface Shape {
  type: 'line' | 'circle' | 'triangle' | 'point' | 'text'
  points: Point[]
  label?: string
  color?: string
}

interface GeometryDrawerProps {
  onInsertSvg: (svgContent: string) => void
}

function GeometryDrawer({ onInsertSvg }: GeometryDrawerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [shapes, setShapes] = useState<Shape[]>([])
  const [currentTool, setCurrentTool] = useState<'line' | 'circle' | 'triangle' | 'point' | 'text'>('line')
  const [currentPoints, setCurrentPoints] = useState<Point[]>([])
  const [showGrid, setShowGrid] = useState(true)
  const [pointLabels, setPointLabels] = useState<string[]>([])
  const [nextLabelIndex, setNextLabelIndex] = useState(0)
  const [scale, setScale] = useState(20) // 每个单位的像素数

  const canvasWidth = 400
  const canvasHeight = 300

  // 获取点的标签（A, B, C, ...）
  const getPointLabel = (index: number): string => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    return letters[index % 26] + (index >= 26 ? Math.floor(index / 26) : '')
  }

  // 绘制画布
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 清空画布
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // 绘制网格
    if (showGrid) {
      ctx.strokeStyle = '#e0e0e0'
      ctx.lineWidth = 1
      for (let x = 0; x <= canvasWidth; x += scale) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvasHeight)
        ctx.stroke()
      }
      for (let y = 0; y <= canvasHeight; y += scale) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvasWidth, y)
        ctx.stroke()
      }
    }

    // 绘制坐标系
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    // X轴
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight / 2)
    ctx.lineTo(canvasWidth, canvasHeight / 2)
    ctx.stroke()
    // Y轴
    ctx.beginPath()
    ctx.moveTo(canvasWidth / 2, 0)
    ctx.lineTo(canvasWidth / 2, canvasHeight)
    ctx.stroke()

    // 绘制已有的图形
    shapes.forEach((shape) => {
      ctx.strokeStyle = shape.color || '#000000'
      ctx.lineWidth = 2

      switch (shape.type) {
        case 'line':
          if (shape.points.length >= 2) {
            ctx.beginPath()
            ctx.moveTo(shape.points[0].x, shape.points[0].y)
            ctx.lineTo(shape.points[1].x, shape.points[1].y)
            ctx.stroke()
          }
          break
        case 'circle':
          if (shape.points.length >= 2) {
            const dx = shape.points[1].x - shape.points[0].x
            const dy = shape.points[1].y - shape.points[0].y
            const radius = Math.sqrt(dx * dx + dy * dy)
            ctx.beginPath()
            ctx.arc(shape.points[0].x, shape.points[0].y, radius, 0, 2 * Math.PI)
            ctx.stroke()
          }
          break
        case 'triangle':
          if (shape.points.length >= 3) {
            ctx.beginPath()
            ctx.moveTo(shape.points[0].x, shape.points[0].y)
            ctx.lineTo(shape.points[1].x, shape.points[1].y)
            ctx.lineTo(shape.points[2].x, shape.points[2].y)
            ctx.closePath()
            ctx.stroke()
          }
          break
        case 'point':
          if (shape.points.length >= 1) {
            const point = shape.points[0]
            ctx.fillStyle = '#000000'
            ctx.beginPath()
            ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI)
            ctx.fill()
            if (point.label) {
              ctx.font = '14px Arial'
              ctx.fillText(point.label, point.x + 6, point.y - 6)
            }
          }
          break
        case 'text':
          if (shape.points.length >= 1 && shape.label) {
            const point = shape.points[0]
            ctx.font = '14px Arial'
            ctx.fillStyle = '#000000'
            ctx.fillText(shape.label, point.x, point.y)
          }
          break
      }
    })

    // 绘制当前正在绘制的图形
    if (currentPoints.length > 0) {
      ctx.strokeStyle = '#666666'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])

      switch (currentTool) {
        case 'line':
          if (currentPoints.length >= 1) {
            ctx.beginPath()
            ctx.moveTo(currentPoints[0].x, currentPoints[0].y)
            ctx.lineTo(currentPoints[0].x, currentPoints[0].y)
            ctx.stroke()
          }
          break
        case 'circle':
          if (currentPoints.length >= 1) {
            ctx.beginPath()
            ctx.arc(currentPoints[0].x, currentPoints[0].y, 10, 0, 2 * Math.PI)
            ctx.stroke()
          }
          break
        case 'triangle':
          if (currentPoints.length >= 1) {
            ctx.beginPath()
            ctx.arc(currentPoints[0].x, currentPoints[0].y, 4, 0, 2 * Math.PI)
            ctx.fill()
          }
          break
      }

      ctx.setLineDash([])
    }
  }, [shapes, currentPoints, currentTool, showGrid, scale])

  // 处理画布点击
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const newPoint: Point = { x, y }

    if (currentTool === 'point') {
      const label = getPointLabel(nextLabelIndex)
      newPoint.label = label
      setNextLabelIndex(nextLabelIndex + 1)
      setShapes([...shapes, { type: 'point', points: [newPoint] }])
      setCurrentPoints([])
    } else if (currentTool === 'text') {
      const text = prompt('输入文本:')
      if (text) {
        setShapes([...shapes, { type: 'text', points: [newPoint], label: text }])
      }
    } else {
      const newPoints = [...currentPoints, newPoint]
      setCurrentPoints(newPoints)

      // 检查是否完成一个图形
      if (
        (currentTool === 'line' && newPoints.length >= 2) ||
        (currentTool === 'circle' && newPoints.length >= 2) ||
        (currentTool === 'triangle' && newPoints.length >= 3)
      ) {
        setShapes([...shapes, { type: currentTool, points: newPoints }])
        setCurrentPoints([])
      }
    }
  }

  // 清空画布
  const handleClear = () => {
    setShapes([])
    setCurrentPoints([])
    setNextLabelIndex(0)
  }

  // 删除最后一个图形
  const handleUndo = () => {
    if (shapes.length > 0) {
      setShapes(shapes.slice(0, -1))
    }
  }

  // 导出 SVG
  const handleExportSvg = () => {
    let svg = `<svg width="${canvasWidth}" height="${canvasHeight}" xmlns="http://www.w3.org/2000/svg">\n`
    svg += `  <rect width="100%" height="100%" fill="white"/>\n`
    
    // 绘制坐标系
    svg += `  <line x1="0" y1="${canvasHeight/2}" x2="${canvasWidth}" y2="${canvasHeight/2}" stroke="black" stroke-width="2"/>\n`
    svg += `  <line x1="${canvasWidth/2}" y1="0" x2="${canvasWidth/2}" y2="${canvasHeight}" stroke="black" stroke-width="2"/>\n`

    // 绘制图形
    shapes.forEach((shape) => {
      const color = shape.color || '#000000'
      switch (shape.type) {
        case 'line':
          if (shape.points.length >= 2) {
            svg += `  <line x1="${shape.points[0].x}" y1="${shape.points[0].y}" x2="${shape.points[1].x}" y2="${shape.points[1].y}" stroke="${color}" stroke-width="2"/>\n`
          }
          break
        case 'circle':
          if (shape.points.length >= 2) {
            const dx = shape.points[1].x - shape.points[0].x
            const dy = shape.points[1].y - shape.points[0].y
            const radius = Math.sqrt(dx * dx + dy * dy)
            svg += `  <circle cx="${shape.points[0].x}" cy="${shape.points[0].y}" r="${radius}" stroke="${color}" stroke-width="2" fill="none"/>\n`
          }
          break
        case 'triangle':
          if (shape.points.length >= 3) {
            const points = shape.points.map(p => `${p.x},${p.y}`).join(' ')
            svg += `  <polygon points="${points}" stroke="${color}" stroke-width="2" fill="none"/>\n`
          }
          break
        case 'point':
          if (shape.points.length >= 1) {
            const point = shape.points[0]
            svg += `  <circle cx="${point.x}" cy="${point.y}" r="4" fill="black"/>\n`
            if (point.label) {
              svg += `  <text x="${point.x + 6}" y="${point.y - 6}" font-size="14" font-family="Arial">${point.label}</text>\n`
            }
          }
          break
        case 'text':
          if (shape.points.length >= 1 && shape.label) {
            const point = shape.points[0]
            svg += `  <text x="${point.x}" y="${point.y}" font-size="14" font-family="Arial">${shape.label}</text>\n`
          }
          break
      }
    })

    svg += `</svg>`

    // 将 SVG 转换为 LaTeX 代码
    const latexCode = `\\begin{figure}[h]\n  \\centering\n  \\def\\svgwidth{${canvasWidth}px}\n  \\input{geometry.svg}\n  \\caption{几何图形}\n\\end{figure}`

    // 创建 SVG 文件下载
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'geometry.svg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    // 插入 LaTeX 代码
    onInsertSvg(latexCode)
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        几何绘图器
      </Typography>

      {/* 工具栏 */}
      <Box sx={{ mb: 2 }}>
        <ButtonGroup size="small" sx={{ mb: 1 }}>
          <Button
            variant={currentTool === 'line' ? 'contained' : 'outlined'}
            onClick={() => { setCurrentTool('line'); setCurrentPoints([]); }}
          >
            <LineIcon /> 直线
          </Button>
          <Button
            variant={currentTool === 'circle' ? 'contained' : 'outlined'}
            onClick={() => { setCurrentTool('circle'); setCurrentPoints([]); }}
          >
            <CircleIcon /> 圆
          </Button>
          <Button
            variant={currentTool === 'triangle' ? 'contained' : 'outlined'}
            onClick={() => { setCurrentTool('triangle'); setCurrentPoints([]); }}
          >
            <TriangleIcon /> 三角形
          </Button>
          <Button
            variant={currentTool === 'point' ? 'contained' : 'outlined'}
            onClick={() => { setCurrentTool('point'); setCurrentPoints([]); }}
          >
            A-Z
          </Button>
          <Button
            variant={currentTool === 'text' ? 'contained' : 'outlined'}
            onClick={() => { setCurrentTool('text'); setCurrentPoints([]); }}
          >
            文本
          </Button>
        </ButtonGroup>
      </Box>

      {/* 画布 */}
      <Box
        sx={{
          border: '1px solid #ccc',
          borderRadius: 1,
          overflow: 'hidden',
          mb: 2,
        }}
      >
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onClick={handleCanvasClick}
          style={{ cursor: 'crosshair', display: 'block' }}
        />
      </Box>

      {/* 操作按钮 */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<UndoIcon />}
          onClick={handleUndo}
          size="small"
        >
          撤销
        </Button>
        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={handleClear}
          size="small"
        >
          清空
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleExportSvg}
          size="small"
          sx={{ bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}
        >
          导出并插入
        </Button>
      </Box>

      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          提示：点击画布绘制图形。选择"点"工具可标注 A-Z 点。
          导出的 SVG 文件需要保存到项目目录。
        </Typography>
      </Box>
    </Paper>
  )
}

// 图标组件
const UndoIcon = () => <DeleteIcon />

export default GeometryDrawer
