document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const startButton = document.getElementById('startButton');
    const textDisplay = document.getElementById('textDisplay');
    const charLimitInput = document.getElementById('charLimit');
    const intervalInput = document.getElementById('interval');
    const applySettingsButton = document.getElementById('applySettings');

    let currentIndex = 0;
    let lines = [];
    let intervalId = null;
    let currentCharLimit = parseInt(charLimitInput.value);
    let currentInterval = parseFloat(intervalInput.value);
    let isFirstDisplay = true;

    function splitTextIntoLines(text, charLimit) {
        const lines = [];
        let currentLine = '';
        
        // 文字列を1文字ずつ処理
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            // 句読点や記号の場合は、その文字を現在の行に追加して新しい行を開始
            if (['。', '、', '！', '？', '．', '，', '!', '?', '.', ','].includes(char)) {
                currentLine += char;
                if (currentLine) {
                    lines.push(currentLine);
                    currentLine = '';
                }
            }
            // 現在の行の長さが制限に達した場合
            else if (currentLine.length >= charLimit) {
                if (currentLine) {
                    lines.push(currentLine);
                    currentLine = char;
                }
            }
            // それ以外の場合は現在の行に文字を追加
            else {
                currentLine += char;
            }
        }
        
        // 最後の行が残っている場合は追加
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines;
    }

    function updateDisplay() {
        textDisplay.innerHTML = '';
        
        for (let i = 0; i < 5; i++) {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'text-line';
            
            if (i === 2) {
                lineDiv.classList.add('highlight');
            } else {
                lineDiv.classList.add('dim');
            }
            
            let lineIndex;
            if (isFirstDisplay) {
                // 最初の表示時は2行の空行を表示
                if (i < 2) {
                    lineDiv.textContent = '';
                } else {
                    lineIndex = currentIndex + (i - 2);
                    lineDiv.textContent = lineIndex < lines.length ? lines[lineIndex] : '';
                }
            } else {
                // 2回目以降は通常通り表示
                lineIndex = currentIndex + i;
                lineDiv.textContent = lineIndex < lines.length ? lines[lineIndex] : '';
            }
            
            textDisplay.appendChild(lineDiv);
        }

        if (isFirstDisplay) {
            isFirstDisplay = false;
        }
        
        currentIndex++;
        if (currentIndex >= lines.length) {
            stopDisplay();
        }
    }

    function startDisplay() {
        const text = inputText.value.trim();
        if (!text) return;

        lines = splitTextIntoLines(text, currentCharLimit);
        currentIndex = 0;
        isFirstDisplay = true;
        
        if (intervalId) {
            clearInterval(intervalId);
        }

        updateDisplay();
        intervalId = setInterval(updateDisplay, currentInterval * 1000);
    }

    function stopDisplay() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    function applySettings() {
        const newCharLimit = parseInt(charLimitInput.value);
        const newInterval = parseFloat(intervalInput.value);

        if (newCharLimit < 1 || newInterval < 0.1) {
            alert('無効な設定値です。文字数は1以上、間隔は0.1秒以上を指定してください。');
            return;
        }

        currentCharLimit = newCharLimit;
        currentInterval = newInterval;

        if (intervalId) {
            stopDisplay();
            startDisplay();
        }
    }

    startButton.addEventListener('click', () => {
        if (intervalId) {
            stopDisplay();
            startButton.textContent = '開始';
        } else {
            startDisplay();
            startButton.textContent = '停止';
        }
    });

    applySettingsButton.addEventListener('click', applySettings);
}); 