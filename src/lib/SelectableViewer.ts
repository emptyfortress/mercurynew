import BaseViewer from 'bpmn-js/lib/Viewer'
import SelectionModule from 'diagram-js/lib/features/selection'
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll'
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas'

export default class SelectableViewer extends BaseViewer {
	constructor(options: any = {}) {
		super({
			...options,
			additionalModules: [SelectionModule, ZoomScrollModule, MoveCanvasModule],
			// отключаем хоткеи и панель
			keyboard: { bindTo: null },
		})
	}
}
