import * as vscode from 'vscode';

class DecToHex{
	private _config = { autoLaunch: true, autoLaunchDelay: 100 };
	constructor() {
        let configSection = vscode.workspace.getConfiguration('dec-to-hex-color-opacity');

        this._config.autoLaunch = configSection.get<boolean>('autoLaunch', this._config.autoLaunch);
        this._config.autoLaunchDelay = configSection.get<number>('autoLaunchDelay', this._config.autoLaunchDelay);
	}

	private fromPercent(valNum: number) {
		var decimalValue = Math.round(valNum*255/100);
	
		if (valNum < 7) {
			var hexValue = "0"+decimalValue.toString(16).toUpperCase();
		}
		else {
			var hexValue = decimalValue.toString(16).toUpperCase();
		}
	
		return hexValue;
	}

	public OnTextEditorSelectionChange(event: vscode.TextEditorSelectionChangeEvent){

		console.log('event: ', event);

		let postion = event.selections[0].active;
		let beforeString = event.textEditor.document.getText(new vscode.Range(postion.line, Math.max(0, postion.character - 11), postion.line, postion.character));
		console.log(beforeString);
        if (/(#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}))(\.\d{2})/.test(beforeString)) {

			let match = /\.\d{2}/.exec(beforeString)

			let dec_color = match && match[0];

			let pline = Number(postion.line);
			let spos = postion.character - beforeString.length + (match ? match.index : 0);
			let epos = spos + (match ? match[0].length : 0);

			let range = new vscode.Range(pline, spos, pline, epos)

			let prc_opac = Math.round(Number("0"+dec_color) * 100);
			let hex_color = this.fromPercent(prc_opac);
			
			event.textEditor.edit((edit: vscode.TextEditorEdit)=>{
				edit.replace(range, hex_color)
			},{undoStopBefore: false, undoStopAfter: false})
			
		}
	}

	dispose() {
    }
}

export function activate(context: vscode.ExtensionContext) {
	let dectohex = new DecToHex();
    vscode.window.onDidChangeTextEditorSelection((e) => { dectohex.OnTextEditorSelectionChange(e); });
    context.subscriptions.push(dectohex);
}

export function deactivate() {}
