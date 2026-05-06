// 游戏全局状态
let diskCount = 3;
let pegs = [[], [], []]; // 三根柱子，数组模拟栈
let moveTimes = 0;
let selectedPeg = null; // 选中的柱子下标
let isAuto = false;     // 是否自动求解中

// 获取元素
const diskNumInput = document.getElementById('diskNum');
const resetBtn = document.getElementById('resetBtn');
const autoBtn = document.getElementById('autoBtn');
const moveCountDom = document.getElementById('moveCount');
const warnDom = document.getElementById('warn');
const pegDomList = [
    document.getElementById('peg0'),
    document.getElementById('peg1'),
    document.getElementById('peg2')
];

// 颜色数组
const colorList = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#9b59b6','#e67e22','#1abc9c','#34495e'];

// 初始化游戏
function initGame() {
    diskCount = parseInt(diskNumInput.value);
    moveTimes = 0;
    moveCountDom.innerText = moveTimes;
    selectedPeg = null;
    pegs = [[], [], []];

    // 左边柱子从小到大放入圆盘
    for(let i = diskCount; i >= 1; i--){
        pegs[0].push(i);
    }

    renderAllPeg();
    hideWarn();
}

// 渲染所有柱子圆盘
function renderAllPeg() {
    pegDomList.forEach((dom, idx) => {
        dom.innerHTML = '';
        // 从下往上渲染
        pegs[idx].forEach((size, index) => {
            let disk = document.createElement('div');
            disk.className = 'disk';
            // 圆盘宽度按大小变化
            disk.style.width = (60 + size * 15) + 'px';
            disk.style.backgroundColor = colorList[size % colorList.length];
            // 垂直位置
            disk.style.bottom = (15 + index * 24) + 'px';
            disk.dataset.size = size;
            disk.dataset.peg = idx;

            // 点击圆盘选中
            disk.onclick = (e) => {
                e.stopPropagation();
                if(isAuto) return;
                selectDisk(idx, size);
            };
            dom.appendChild(disk);
        });
    });
}

// 选中圆盘
function selectDisk(pegIdx, size) {
    // 只能选最上面一个
    if(pegs[pegIdx][pegs[pegIdx].length - 1] !== size){
        showWarn('只能移动最上方圆盘');
        return;
    }

    // 取消之前选中
    clearActive();

    // 再次点击同一柱子取消选中
    if(selectedPeg === pegIdx){
        selectedPeg = null;
        return;
    }

    selectedPeg = pegIdx;
    // 加高亮
    let disks = pegDomList[pegIdx].querySelectorAll('.disk');
    disks[disks.length - 1].classList.add('active');
}

// 点击柱子放置
pegDomList.forEach((dom, idx) => {
    dom.onclick = () => {
        if(isAuto) return;
        if(selectedPeg === null || selectedPeg === idx) return;

        // 取出源柱子顶部
        let fromTop = pegs[selectedPeg].pop();
        let toTop = pegs[idx].length ? pegs[idx][pegs[idx].length - 1] : null;

        // 规则：大不能压小
        if(toTop !== null && fromTop > toTop){
            // 放回去
            pegs[selectedPeg].push(fromTop);
            showWarn('不能大盘压小盘！');
            renderAllPeg();
            selectedPeg = null;
            return;
        }

        // 合法移动
        pegs[idx].push(fromTop);
        moveTimes++;
        moveCountDom.innerText = moveTimes;
        selectedPeg = null;
        hideWarn();
        renderAllPeg();

        // 判断胜利
        checkWin();
    };
});

// 清除选中高亮
function clearActive() {
    document.querySelectorAll('.disk.active').forEach(el=>{
        el.classList.remove('active');
    });
}

// 显示警告
function showWarn(text) {
    warnDom.innerText = text;
    warnDom.style.opacity = 1;
}
function hideWarn() {
    warnDom.style.opacity = 0;
}

// 判断胜利
function checkWin() {
    if(pegs[2].length === diskCount){
        setTimeout(()=>{
            alert('恭喜！闯关成功 🎉');
        },300);
    }
}

// 重置按钮
resetBtn.onclick = () => {
    isAuto = false;
    initGame();
};

// 切换圆盘数量自动重置
diskNumInput.onchange = () => {
    initGame();
};

// 自动求解按钮（后面我再给你补完整递归代码，先保证能手动玩）
autoBtn.onclick = () => {
    alert('自动求解下一步我教你加，现在可以先手动玩');
};

// 页面初始化
window.onload = initGame;