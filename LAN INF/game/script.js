/**
 * PROJECT: LAN INFILTRATOR - Trace & Detection Update
 */

const input = document.getElementById('cli-input');
const output = document.getElementById('output');
const buildingMap = document.getElementById('building-map');
const traceBar = document.getElementById('trace-bar');
const traceValue = document.getElementById('trace-value');

let history = [];
let historyIndex = -1;
let inventory = [];
let traceLevel = 0;
let isGameOver = false;

let activeVerification = null;
let verificationTargetNode = null;

const building = [
    { id: 'lobby', name: 'Hall', status: 'infected', key: null, requiredKey: null },
    { id: 'office', name: 'Offices', status: 'secured', key: 'CEO_PASS_77', requiredKey: null },
    { id: 'storage', name: 'Storage', status: 'secured', key: 'DEV_ACCESS_01', requiredKey: null },
    { id: 'dev', name: 'Developer office', status: 'secured', key: 'SRV_ROOT_99', requiredKey: 'DEV_ACCESS_01' },
    { id: 'hr', name: 'HR office', status: 'secured', key: null, requiredKey: null },
    { id: 'chill', name: 'Chill Zone', status: 'secured', key: 'GUEST_WIFI', requiredKey: null },
    { id: 'archive', name: 'Archives', status: 'secured', key: null, requiredKey: null },
    { id: 'ceo', name: 'CEO office', status: 'secured', key: null, requiredKey: 'CEO_PASS_77' },
    { id: 'server', name: 'Server room', status: 'secured', key: null, requiredKey: 'SRV_ROOT_99' }
];

/**
 * Aktualizuje ukazatel detekce
 */
function updateTrace(amount) {
    if (isGameOver) return;
    traceLevel = Math.min(100, traceLevel + amount);
    traceBar.style.width = traceLevel + "%";
    traceValue.innerText = Math.floor(traceLevel);

    if (traceLevel > 70) {
        traceBar.style.background = "#f00";
        document.getElementById('detection-wrapper').style.color = "#f00";
    } else if (traceLevel > 40) {
        traceBar.style.background = "#ffa500";
        document.getElementById('detection-wrapper').style.color = "#ffa500";
    }

    if (traceLevel >= 100) {
        triggerGameOver();
    }
}

function triggerGameOver() {
    isGameOver = true;
    print("!!! ALARM: CONNECTION TERMINATED BY HOST !!!", "error-text");
    print("YOUR LOCATION WAS LEAKED. SECURITY IS ON THEIR WAY.", "error-text");
    input.disabled = true;
    input.placeholder = "SYSTEM LOCKED";
}

function renderBuilding() {
    buildingMap.innerHTML = '';
    building.forEach(room => {
        const div = document.createElement('div');
        div.className = `room ${room.status}`;
        div.innerHTML = `
            <span class="room-name">${room.name}</span>
            <span class="room-id">[${room.id}]</span>
        `;
        buildingMap.appendChild(div);
    });
}

function print(text, className = '') {
    const div = document.createElement('div');
    div.className = 'entry ' + className;
    div.innerHTML = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
}

function generateSequence(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function processCommand(cmd) {
    if (isGameOver) return;
    const cleanInput = cmd.toLowerCase().trim();
    const parts = cleanInput.split(' ');
    const command = parts[0];
    const argument = parts[1];

    if (activeVerification) {
        if (cleanInput === activeVerification) {
            print(">>> SEQUENCE MATCHED. BYPASS SUCCESSFUL.", "gain-text");
            verificationTargetNode.status = 'infected';
            updateTrace(5); // Malé zvýšení za úspěch
            renderBuilding();
            const remainingNodes = building.filter(room => room.status !== 'infected');

            if (remainingNodes.length === 0) {
                triggerWin(); // Pokud jsou všechny infected, vyhráváš
            } else {
                print(`Zbývající cíle v síti: ${remainingNodes.length}`, "system-text");
            }
        } else {
            print(">>> SEQUENCE MISMATCH. ALERT FOR SECURITY SENT.", "error-text");
            updateTrace(20); // Velké zvýšení za chybu
        }
        activeVerification = null;
        verificationTargetNode = null;
        return;
    }

    switch (command) {
        case 'help':
            print(`
                <b>COMMANDS:</b><br>
                --------------------------------------------------<br>
                <b>scan</b>          - Detection of rooms<br>
                <b>infect [id]</b>   - Will infect a room<br>
                <b>search [id]</b>   - Scanning of room for keys<br>
                <b>clear</b>         - Clear terminal<br>
                --------------------------------------------------
                
            `, "system-text");
            break;

        case 'clear':
            output.innerHTML = '';
            break;

        case 'scan':
            print("Topology scanning...", "system-text");
            updateTrace(4);
            setTimeout(() => {
                const nodes = building.map(r => `${r.id} [${r.status.toUpperCase()}]`);
                print(nodes.join(' | '), "gain-text");
            }, 500);
            break;

        case 'infect':
            if (!argument) {
                print("ERROR: infect [id]", "error-text");
                return;
            }
            const targetRoom = building.find(r => r.id === argument);
            if (!targetRoom || targetRoom.status === 'infected') {
                print("ERROR", "error-text");
                return;
            }

            if (targetRoom.requiredKey && !inventory.includes(targetRoom.requiredKey)) {
                targetRoom.status = 'locked';
                renderBuilding();
                updateTrace(7);
                print(`!!! ACCESS DENIED, FIREWALL KEY IS NEEDED!`, "error-text");
                return;
            }

            const seq = generateSequence(5);
            activeVerification = seq.split('').reverse().join('');
            verificationTargetNode = targetRoom;
            print(`DECODE THE KEY: <span style="color:yellow; font-weight:bold;">${seq}</span>`, "system-text");
            break;

        case 'search':
            if (!argument) {
                print("ERROR: search [id]", "error-text");
                return;
            }
            const searchRoom = building.find(r => r.id === argument);
            if (!searchRoom || searchRoom.status !== 'infected') {
                print("Místnost není kompromitována.", "error-text");
                return;
            }
            print(`SCANNING ${searchRoom.name}...`, "system-text");
            updateTrace(6);
            setTimeout(() => {
                if (searchRoom.key && !inventory.includes(searchRoom.key)) {
                    inventory.push(searchRoom.key);
                    print(`>>> KEY FOUND: ${searchRoom.key}`, "gain-text");
                } else {
                    print("Data wasn't found here.", "system-text");
                }
            }, 1000);
            break;

        default:
            print(`Unknown command: ${command}`, "error-text");
    }
}

// Listenery (zůstávají stejné)
input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        const val = input.value;
        if (val.trim() !== "" && !isGameOver) {
            print("> " + val, 'command-text');

            // Tady se ukládá do pole history
            history.push(val);
            historyIndex = history.length;

            processCommand(val);
        }
        input.value = "";
    }
    else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            input.value = history[historyIndex];
        }
    }
    else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < history.length - 1) {
            historyIndex++;
            input.value = history[historyIndex];
        } else {
            historyIndex = history.length;
            input.value = "";
        }
    }
});

function triggerWin() {
    isGameOver = true;
    setTimeout(() => {
        print("<br>##############################################", "gain-text");
        print("MISSION COMPLETED.", "gain-text");
        print("ALL ROOMS ARE INFECTED.", "gain-text");
        print("STOLEN DATA WERE SOLD.", "system-text");
        print("##################################################", "gain-text");
        
        // Vizuální signalizace konce
        document.getElementById('building-map').style.boxShadow = "0 0 50px #0f0";
        input.disabled = true;
        input.placeholder = "ALL NODES COMPROMISED";
    }, 500);
}
document.getElementById('console-container').addEventListener('click', () => { if (!isGameOver) input.focus(); });
renderBuilding();