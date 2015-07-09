function editor(editor) {

	initialize();
	
	//-----------------------编辑器初始化-----------------------//
	var currentRange;
	var bool = true;
	var isFull = true;
	var isShowColor = true;
	var isShowLink = true;
	var isShowTable = true;
	var isShowIndetCode = true;

	function  initialize() {
		buttons = {
			formatblock:'设置标题',
			bold: '加粗',
			italic : '斜体',				
			underline : '下划线',
			forecolor: '字体颜色',
			backcolor: '背景颜色',
			removeFormat: '清除格式',
			insertorderedlist: '有序列表',	
			insertunorderedlist: '无序列表',
			indent: '增加缩进',
			outdent: '减少缩进',
			justifyleft: '左对齐',			
			justifycenter: '居中对齐',			
			justifyright: '右对齐',
			justifyFull: '两端对齐',								
			createlink: '创建连接',
			unlink: '取消连接',
			inserttable: '插入表格',
			insertimage: '图像',
			insertvideo: '插入视频',
			insertcode: '插入代码',
			upload: '附件上传',
			fullscreen: '全屏编辑',
		};

		var icons = {
			formatblock:'<em>段落</em><span>&#xf0dc</span>',
			bold: '&#xf032;',
			italic : '&#xf033;',				
			underline : '&#xf0cd;',
			forecolor : '&#xf031;',
			backcolor : '&#xf14b;',
			removeFormat: '&#xf12d',
			insertorderedlist: '&#xf0cb;',
			insertunorderedlist: '&#xf0ca;',
			indent: '&#xf03c;',
			outdent: '&#xf03b;',
			justifyleft: '&#xf036;',			
			justifycenter: '&#xf037;',				
			justifyright: '&#xf038;',
			justifyFull: '&#xf039;',								
			createlink: '&#xf0c1;',
			unlink: '&#xf127;',
			inserttable: '&#xf0ce;',
			insertimage: '&#xf03e;',
			insertvideo: '&#xf03d;',
			insertcode: '&#xf121;',
			upload: '&#xf093;',
			fullscreen: '&#xf0b2;',
		};

		formatBlock = {
			p : '段落',
			h1: '标题1',
			h2: '标题2',
			h3: '标题3',
			h4: '标题4',
		};

		colors = [
			'#000000', '#000033', '#000066', '#006666', '#006699', '#0066CC', '#0066FF', '#009900', '#00CC99', '#00CC00', '#00CC33', '#00CCFF', '#990000', '#990033', '#9933CC', '#CC0000', '#CC3366', '#CC9933', '#CCCC66', '#FF0033', '#FF0066', '#FF3366', '#FF6666', '#FFFF99', '#FF99FF', '#999999', '#cccccc', '#eeeeee', '#ffffff'
		];

		code = {
			php: 'php',
			javascript: 'JavaScript',
			cpp: 'c/c++',
			html: 'html',
			css: 'css',
			sql: 'SQL',
		};

		textarea = document.getElementById(editor);
		textarea.style.display = 'none';
		editorName = 's'+textarea.id;
		edit = document.createElement('div');

		toolbar = document.createElement('div');
		design = document.createElement('div');

		// 点击，输入时获取选区以及光标的位置
		design.addEventListener('mouseup',  function() {
			saveSelection();
		});

		design.addEventListener('keyup', function() {
			saveSelection();
		});

		design.addEventListener('blur', function(){
			var content = this.innerHTML;
			content = content.replace(/&/gm, '&amp;').replace(/</gm, '&lt;').replace(/>/gm, '&gt;').replace(/\n/gm, '<br>');
			textarea.innerHTML = content;
		});


		edit.setAttribute('id', editorName);
		edit.setAttribute('class', 'editor');

		toolbar.setAttribute('class', 'toolbar');
		design.setAttribute('class', 'design');
		design.setAttribute('contenteditable', true);

		textarea.parentNode.insertBefore(edit, textarea);
		edit.appendChild(toolbar);
		edit.appendChild(design);

		
		createToolbar(buttons, icons);
		var aButton = toolbar.getElementsByTagName('a');
		tooLbarEvent(aButton);

		editHeight = edit.offsetHeight;
		toolHeight = toolbar.offsetHeight;
		designHeight = editHeight - toolHeight - 30;
		design.style.height = designHeight+'px';
		
	}


	
	//---------------------------------创建工具栏--------------------------------------//

	function createToolbar(buttons, icons) {
		for(var i in buttons) {
			var button = document.createElement('a');
			var icon = document.createElement('i');
			icon.innerHTML = icons[i];
			button.appendChild(icon);
			button.setAttribute('id', i);
			button.setAttribute('title', buttons[i]);
			toolbar.appendChild(button);
		}
	}


	//-------------------------工具栏点击事件绑定并执行相应操作------------------------------//

	function tooLbarEvent(but) {
		for(var i=0; i<but.length; i++) {
			but[i].addEventListener('click', function() {

				var command = this.getAttribute('id');
				switch(command) {
					case 'formatblock' :
						createFormatBlock(command);
						break;

					case 'forecolor' :
						if(isShowColor) { 
							this.setAttribute('class', 'on'); 
						} else{ 
							this.removeAttribute('class', 'on'); 
						}
						setColor(command);
						break;

					case 'backcolor' :
						if(isShowColor) { 
							this.setAttribute('class', 'on'); 
						} else{ 
							this.removeAttribute('class', 'on'); 
						}
						setColor(command);
						break;

					case 'createlink' :
						if(isShowLink) { 
							this.setAttribute('class', 'on'); 
						} else { 
							this.removeAttribute('class', 'on'); 
						}
						createLink();
						break;

					case 'inserttable' :
						if(isShowTable) { 
							this.setAttribute('class', 'on'); 
						} else { 
							this.removeAttribute('class', 'on'); 
						}
						createTable();
						break;

					case 'insertimage' :
						alert('此功能开发中......!');
						break;

					case 'insertvideo' :
						alert('此功能开发中......!');
						break;

					case 'insertcode' :
						insertCode();
						break;

					case 'upload' :
						alert('此功能开发中......!');
						break;
					case 'fullscreen' :
						fullScreen();
						break;
					default :
						restoreSelection();
						createCommand(command, null);
						saveSelection();
						break;
				}

				// 单击工具栏完成执行命令后继续检测
				if(command == 'bold' || command == 'italic' || command == 'underline' || command == 'removeFormat' || command == 'justifyleft' || command == 'justifyright' || command == 'justifycenter' || command == 'justifyFull') {
					updateToolbar();
				} else {
					return true;
				}
					
			});
		}
	}


	//-------------------------------设置默认回车产生的标签------------------------------------//

	design.addEventListener('keypress', function(e){
		e = e||window.event;
		var cmd = document.queryCommandValue('formatblock');

		if (e.keyCode == 13){
			if(cmd == "p" || cmd == "div" || cmd == "h1" || cmd == "h2"|| cmd == "h3" || cmd == "h4" || cmd=="h5" || cmd == "h6"){
				return true;
			}else{
				document.execCommand("formatblock", false, "<p>");
			}
		}

	});

	//-------------------------------   全屏切换   ------------------------------------//

	function fullScreen() {
		var ele = document.getElementById('fullscreen');
		if(isFull){
			ele.style.backgroundColor = '#f8f8f8';
			ele.style.boxShadow = '0px 0px 3px #ccc inset';
			ele.style.borderRadius = '2px';
			ele.getElementsByTagName('i')[0].innerHTML = '&#xf066';
			edit.style.position = 'fixed';
			edit.style.top = '1px';
			edit.style.left = '1px';
			edit.style.right = '1px';
			edit.style.height = 'auto';
			edit.style.bottom = '1px';
			isFull = false;
		}else{
			ele.removeAttribute('style');
			ele.getElementsByTagName('i')[0].innerHTML = '&#xf0b2';
			edit.removeAttribute('style');
			isFull = true;
		}
		
	}

	//--------------------------------- 更新工具栏选中状态 ------------------------------------//
	
	// 当按下键盘上的特殊键位时检测命令
	design.addEventListener('keyup', function(e){
		e=e||window.event;
		if (e.keyCode == 13 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 8){
			for(var i in buttons) {
				var command = commandState(i);
				if(command) {
					var eles = document.getElementById(i);
					eles.setAttribute('class', 'on');
				}else{
					var eles = document.getElementById(i);
					eles.removeAttribute('class');
				}
			}
		}
	});

	// 当点击可编辑区域时检测命令状态
	design.addEventListener('click', function() {
		updateToolbar();

		if(!isShowColor) {
			var colorPanel = document.getElementById('colorPanel');
			toolbar.removeChild(colorPanel);
			isShowColor = true;
		}
	});

	// 检测命令
	function commandState(command) {
		var cmd = document.queryCommandState(command);
		if(command == "formatblock") {
			var command = commandVlaue('formatblock');
			var formatName = document.getElementById('formatblock').getElementsByTagName('em')[0];
			if(formatBlock[command] == undefined) {
				command = 'p';
			}
			formatName.innerHTML = formatBlock[command];
		}
		if(cmd){ return true; } else { return false; }
	}

	// 循环更新工具栏状态
	function updateToolbar() {
		for(var i in buttons) {
			var command = commandState(i);
			if(command) {
				var eles = document.getElementById(i);
				eles.setAttribute('class', 'on');
			}else{
				var eles = document.getElementById(i);
				eles.removeAttribute('class');
			}
		}
	}

	// 检测命令值
	function commandVlaue(command) {
		return document.queryCommandValue(command);
	}


	function createCommand(command, bool, value) {
		document.execCommand(command, false, value);
	}


	//---------------------------------range selection相关--------------------------------------//
	

	function saveSelection() {
		var selection = document.getSelection();
		if(selection.getRangeAt && selection.rangeCount){
			currentRange = selection.getRangeAt(0);
		}
	}

	function restoreSelection() {
		// 如果不存在选区，焦点置于编辑器开始处
		if(!currentRange) {
			design.focus(); return true;
		}

		var selection = document.getSelection();
		if(selection.rangeCount > 0) {
			selection.removeAllRanges();
		}

		var range = document.createRange();
		selection.addRange(currentRange);

	}

	//---------------------------------FormatBlock相关------------------------------------//


	function createFormatBlock(command) {

		var format = document.getElementById(command);
		var formatName = format.getElementsByTagName('em')[0];
		format.setAttribute('class', 'on');

		if(bool){
			createFormatList(); bool = false;
		}else{
			var list = document.getElementById('formatlist');
			format.removeAttribute('class');
			toolbar.removeChild(list); bool = true;
		}
		
		function createFormatList() {
			var list = document.createElement('ul');
			list.setAttribute('id','formatlist');
			toolbar.style.position = "relative";
			for(var i in formatBlock) {
				var listOption = document.createElement('li');
				listOption.innerHTML = formatBlock[i];
				listOption.setAttribute('id', i);
				list.appendChild(listOption);
			}
			var option = list.getElementsByTagName('li');
			for(var i=0; i<option.length; i++) {
				option[i].addEventListener('click', function(){
					formatName.innerHTML = this.innerHTML;
					var value = '<'+this.getAttribute('id')+'>';
					restoreSelection();
					document.execCommand('formatblock', false, value);
					saveSelection();
					toolbar.removeChild(list); bool = true;
					format.removeAttribute('class', 'on');
				});
			}
			toolbar.appendChild(list);
		}
	}

	//---------------------------------设置字体、背景颜色------------------------------------//

	function setColor(command) {

		var colorPanel = document.createElement('ul');
		if(isShowColor) {
			show(); isShowColor = false;
		} else {
			hide(); isShowColor = true;
		}

		function show() {
			colorPanel.setAttribute('id', 'colorPanel');

			toolbar.style.position = "relative";
			colorPanel.style.top = "37px";
			if(command === 'forecolor') {
				colorPanel.style.left = "167px";
			}
			if(command === 'backcolor') {
				colorPanel.style.left = "204px";
			}
			for(var i in colors) {
				var li = document.createElement('li');
				var span = document.createElement('span');
				li.appendChild(span);
				span.style.backgroundColor = colors[i];
				span.setAttribute('data-color', colors[i]);
				colorPanel.appendChild(li);
			}

			var colorButton = colorPanel.getElementsByTagName('span');

			for(var i=0; i<colorButton.length; i++) {
				colorButton[i].addEventListener('click', function() {
					var colorValue = this.getAttribute('data-color');
					restoreSelection();
					document.execCommand(command, false, colorValue);
					saveSelection();
				});
			}

			toolbar.appendChild(colorPanel);
		}

		function hide() {
			var colorPanel = document.getElementById('colorPanel');
			toolbar.removeChild(colorPanel);
		}
			
	}

	//---------------------------------创建链接------------------------------------//

	function createLink() {
		var link = document.createElement('div');
		link.setAttribute('id', 'link');

		if(isShowLink) {
			show(); isShowLink = false;
		}else{
			hide(); isShowLink = true;
		}

		function show() {
			
			var fieldset = document.createElement('fieldset');
			var url = document.createElement('input');

			var title = document.createElement('input');
			title.setAttribute('class', 'title');
			var titleLabel = document.createElement('label');
			titleLabel.innerHTML = "链接标题：";
			var titleFieldset = document.createElement('fieldset');

			var label = document.createElement('label');
			var setdiv = document.createElement('div');
			var close = document.createElement('a');
			var ok = document.createElement('a');
			close.setAttribute('class', 'close');
			close.innerHTML = "取消";
			ok.setAttribute('class', 'ok');
			ok.innerHTML = "确定";
			setdiv.setAttribute('class', 'setdiv');
			
			url.setAttribute('type', 'text');
			url.setAttribute('value', 'http://');
			url.setAttribute('id', 'url');
			label.innerHTML = "链接地址：";

			if(!currentRange){
				setdiv.appendChild(close);
				setdiv.appendChild(ok);
				fieldset.appendChild(label);
				fieldset.appendChild(url);
				titleFieldset.appendChild(titleLabel);
				titleFieldset.appendChild(title);
				link.appendChild(fieldset);
				link.appendChild(titleFieldset);
			}else{
				if(currentRange.collapsed) {
					setdiv.appendChild(close);
					setdiv.appendChild(ok);
					fieldset.appendChild(label);
					fieldset.appendChild(url);
					titleFieldset.appendChild(titleLabel);
					titleFieldset.appendChild(title);
					link.appendChild(fieldset);
					link.appendChild(titleFieldset);
				}else{
					
					setdiv.appendChild(close);
					setdiv.appendChild(ok);
					fieldset.appendChild(label);
					fieldset.appendChild(url);
					link.appendChild(fieldset);
				}
			}
			
			link.appendChild(setdiv);
			edit.appendChild(link);
			var linkState = document.getElementById('createlink');
			if(!currentRange){
				ok.addEventListener('click', function() {
					restoreSelection();
					var urlVlaue = url.value;
					var titleValue = title.value;
					var linktag = '<a href="'+urlVlaue+'"'+'>'+titleValue+'</a>';
					document.execCommand('insertHTML', false, linktag);
					saveSelection();
					hide(); isShowLink = true;
					linkState.removeAttribute('class');
				});
			} else {
				if(currentRange.collapsed){
					ok.addEventListener('click', function() {
						restoreSelection();
						var urlVlaue = url.value;
						var titleValue = title.value;
						var linktag = '<a href="'+urlVlaue+'"'+'>'+titleValue+'</a>';
						document.execCommand('insertHTML', false, linktag);
						saveSelection();
						hide(); isShowLink = true;
						linkState.removeAttribute('class');
					});
				}else{
					ok.addEventListener('click', function() {
						restoreSelection();
						var urlVlaue = url.value;
						document.execCommand('createlink', false, urlVlaue);
						saveSelection();
						hide(); isShowLink = true;
						linkState.removeAttribute('class');
					});
				}
			}

			close.addEventListener('click', function() {
				
				hide(); isShowLink = true;
			});
		}

		function hide() {
			var linkState = document.getElementById('createlink');
			linkState.removeAttribute('class');
			var link = document.getElementById('link');
			edit.removeChild(link);
		}
		
	}


	function createTable(width, height) {
		
		if(isShowTable) {
			show(); isShowTable = false;
		}else{
			hide(); isShowTable = true;
		}
		
		var tableStale = document.getElementById('inserttable');

		function show() {
			var tableContainer = document.createElement('div');
			tableContainer.setAttribute('id', 'tableContainer');
			
			var container = document.createElement('div');
			container.setAttribute('class', 'container');
			var row = document.createElement('input');
			var col = document.createElement('input');
			var width = document.createElement('input');
			var height = document.createElement('input');
			var ok = document.createElement('a');
			var close = document.createElement('a');
			var lineone = document.createElement('fieldset');
			var linetwo = document.createElement('fieldset');
			var rowLable = document.createElement('label');
			var colLable = document.createElement('label');
			var wLable = document.createElement('label');
			var hLable = document.createElement('label');

			rowLable.innerHTML = "行数：";
			colLable.innerHTML = "列数：";
			wLable.innerHTML = "宽度：";
			hLable.innerHTML = "高度：";

			row.setAttribute('type', 'text');
			row.value=3;
			col.setAttribute('type', 'text');
			col.value=5;
			width.setAttribute('type', 'text');
			width.value=600;
			height.setAttribute('type', 'text');
			height.value=100;
			ok.innerHTML = "插入";
			close.innerHTML = "取消";


			tableContainer.appendChild(container);
			lineone.appendChild(rowLable);
			lineone.appendChild(row);
			lineone.appendChild(colLable);
			lineone.appendChild(col);

			linetwo.appendChild(wLable);
			linetwo.appendChild(width);
			linetwo.appendChild(hLable);
			linetwo.appendChild(height);

			var setdiv = document.createElement('div');
			setdiv.setAttribute('class', 'setdiv');

			container.appendChild(lineone);
			container.appendChild(linetwo);

			setdiv.appendChild(close);
			setdiv.appendChild(ok);

			container.appendChild(setdiv);

			edit.appendChild(tableContainer);

			ok.addEventListener('click', function(){
				var builder = builderTable(width, height, row, col);
				restoreSelection();
				document.execCommand('insertHTML', false, builder);
				saveSelection();
				edit.removeChild(tableContainer);
				isShowTable = true;
				tableStale.removeAttribute('class');
			});

			close.addEventListener('click', function() {
				hide();
			});
		}

		function hide() {
			var tableStale = document.getElementById('inserttable');
			var tableContainer = document.getElementById('tableContainer');
			edit.removeChild(tableContainer);
			tableStale.removeAttribute('class');
			isShowTable = true;
		}

		function builderTable(width, height, row, col) {
			var builder = [];
			builder.push('<table cellpadding="0" cellspacing="0" width="');
			builder.push(width.value);
			builder.push('"height="');
			builder.push(height.value);
			builder.push('">');
			for(var r = 0; r < row.value; r++){
				builder.push('<tr>');
				for(var c = 0; c < col.value; c++){
					builder.push('<td> </td>');
				}
				builder.push('</tr>');
			}
			builder.push('</table>');
			return builder.join("");
		}

	}


	//---------------------------------插入代码------------------------------------//

	function insertCode() {

		if(isShowIndetCode) {
			show(); isShowIndetCode = false;
		} else {
			hide(); isShowIndetCode = true;
		}

		function show() {
			//var lang;

			var codeContainer = document.createElement('div');
			var langFieldset = document.createElement('fieldset');
			var langSelect = document.createElement('select');
			var langLabel = document.createElement('label');

			var ok = document.createElement('a');
			var close = document.createElement('a');
			ok.innerHTML = "插入";
			close.innerHTML = "取消";

			var setdiv = document.createElement('div');
			setdiv.setAttribute('class', 'setdiv');
			setdiv.appendChild(close);
			setdiv.appendChild(ok);
			langLabel.innerHTML = "选择语言：";
			
			for(var i in code) {
				var option = document.createElement('option');
				option.value = i;
				option.text = code[i];
				langSelect.appendChild(option);
			}
			

			var codeFieldset = document.createElement('fieldset');
			var codeTextarea = document.createElement('textarea');
			codeTextarea.setAttribute('rows', 13);
			langFieldset.appendChild(langLabel);
			langFieldset.appendChild(langSelect);
			codeFieldset.appendChild(codeTextarea);

			codeContainer.setAttribute('id', 'codeContainer');
				
			codeContainer.appendChild(langFieldset);
			codeContainer.appendChild(codeFieldset);
			codeContainer.appendChild(setdiv);

			edit.appendChild(codeContainer);
				
			lang = langSelect.firstChild.value;
			langSelect.addEventListener('change', function() {
				lang = this.value;
			});

			ok.addEventListener('click', function() {
				var codeText = codeTextarea.value;
				
				// 字符串替换
				codeText = codeText.replace(/&/gm, '&amp;').replace(/</gm, '&lt;').replace(/>/gm, '&gt;').replace(/\n/gm, '<br>');

				var preTag = '<div><pre><code class="'+lang+' hljs">'+codeText+'</code></pre></div><br />';
				restoreSelection();
				document.execCommand('insertHTML', false, preTag);
				saveSelection();
				edit.removeChild(codeContainer);
				isShowIndetCode = true;
			});

			close.addEventListener('click', function() {
				isShowIndetCode = true;
				hide();
			});
		}

		function hide() {
			var codeContainer = document.getElementById('codeContainer');
			edit.removeChild(codeContainer);
		}

	}
	
}

