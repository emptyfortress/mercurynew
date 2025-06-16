// rename-icon-names.ts
import fs from 'fs'
import path from 'path'

// Путь к папке с компонентами
const dir = path.resolve(__dirname, './src/components/icons/list')

const files = fs.readdirSync(dir).filter((file) => file.endsWith('.vue'))

files.forEach((file) => {
	const filePath = path.join(dir, file)
	let content = fs.readFileSync(filePath, 'utf-8')

	const fileName = path.basename(file, '.vue')
	const componentName = fileName.charAt(0).toUpperCase() + fileName.slice(1)

	const nameRegex = /name:\s*['"`](.*?)['"`]/
	const newNameLine = `name: '${componentName}'`

	if (nameRegex.test(content)) {
		// Заменяем существующий name
		content = content.replace(nameRegex, newNameLine)
	} else {
		// Если нет name — добавляем его в export default
		const exportRegex = /export\s+default\s*{/
		content = content.replace(exportRegex, `export default {\n  ${newNameLine},`)
	}

	fs.writeFileSync(filePath, content, 'utf-8')
	console.log(`✅ Updated ${file} -> ${componentName}`)
})
