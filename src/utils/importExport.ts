import type { Exam } from '@/types/exam'
import { normalizeExam } from '@/types/exam'

/**
 * 导出试卷数据为 JSON 文件
 */
export function exportExamToJson(exam: Exam, filename: string = 'exam.json'): void {
  const json = JSON.stringify(exam, null, 2)
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 从 JSON 文件导入试卷数据
 */
export function importExamFromJson(file: File): Promise<Exam> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string
        const exam = normalizeExam(JSON.parse(json) as Exam)
        
        // 验证数据结构
        if (!exam.info || !Array.isArray(exam.contents)) {
          throw new Error('无效的试卷数据格式')
        }
        
        resolve(exam)
      } catch (error) {
        reject(new Error(`导入失败: ${error instanceof Error ? error.message : '未知错误'}`))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('读取文件失败'))
    }
    
    reader.readAsText(file)
  })
}

/**
 * 从 JSON 字符串导入试卷数据
 */
export function importExamFromJsonString(jsonString: string): Exam {
  try {
    const exam = normalizeExam(JSON.parse(jsonString) as Exam)
    
    // 验证数据结构
    if (!exam.info || !Array.isArray(exam.contents)) {
      throw new Error('无效的试卷数据格式')
    }
    
    return exam
  } catch (error) {
    throw new Error(`导入失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 复制 JSON 到剪贴板
 */
export function copyExamToClipboard(exam: Exam): Promise<void> {
  const json = JSON.stringify(exam, null, 2)
  return navigator.clipboard.writeText(json)
}

/**
 * 从剪贴板粘贴 JSON 数据
 */
export async function pasteExamFromClipboard(): Promise<Exam> {
  try {
    const text = await navigator.clipboard.readText()
    return importExamFromJsonString(text)
  } catch (error) {
    throw new Error('从剪贴板读取失败，请确保已复制有效的 JSON 数据')
  }
}
