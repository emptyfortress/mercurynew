// rename-icon-names.js
const fs = require('fs')
const path = require('path')

const dir = path.resolve(__dirname, './src/components/icons/list')

const files = fs.readdirSync(dir).filter((file) => file.endsWith('.vue'))

let id = 0

files.forEach((file) => {
	const filePath = path.join(dir, file)
	let content = fs.readFileSync(filePath, 'utf-8')

	const name = path.basename(file, '.vue')
	const componentName = name.charAt(0).toUpperCase() + name.slice(1)

	const nameRegex = /name:\s*['"`](.*?)['"`]/
	const newNameLine = `name: '${componentName}'`

	if (nameRegex.test(content)) {
		content = content.replace(nameRegex, newNameLine)
	} else {
		content = content.replace(/export\s+default\s*{/, `export default {\n  ${newNameLine},`)
	}

	fs.writeFileSync(filePath, content, 'utf-8')
	console.log(`✅ Updated ${file} -> ${componentName}`)
})
