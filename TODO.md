# Main goal

Текущая задача - переделка страницы Конструктор процессов (/dvmain/process/constructor)

## Current work

Настраиваем внешний вид узлов на диаграмме.

## Main components for the task

- стартовый компонент:
  - src/components/process/SingleMonitorContent1.vue

- компонент библиотеки
  - src/components/process/ConstructoLibraryPanel.vue

## Requirements

Обычный узел:

- Узел на диаграмме должен содержать большую иконку слева, название справа.

Узлы (И, ИЛИ, Разветление):

- форма узла - круг, в центре иконка и ниже название

Группа узлов по обмену данными:

- форма узла параллелограмм, иконка слева, название справа
