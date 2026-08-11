/* ==================================================
   QUEST SYSTEM 0.2
   ================================================== */


/* ==================================================
   DATA
   ================================================== */

let account = loadAccount();

let notificationTimer = null;


/* ==================================================
   ELEMENT
   ================================================== */

const homeScreen =
    document.getElementById("homeScreen");

const accountScreen =
    document.getElementById("accountScreen");

const mainScreen =
    document.getElementById("mainScreen");

const folderScreen =
    document.getElementById("folderScreen");

const questModal =
    document.getElementById("questModal");


/* ==================================================
   LOAD ACCOUNT
   ================================================== */

function loadAccount() {

    try {

        const saved =
            localStorage.getItem("questAccount");

        if (!saved) {
            return null;
        }

        const data =
            JSON.parse(saved);

        if (
            !data ||
            typeof data !== "object"
        ) {
            return null;
        }

        if (
            typeof data.name !== "string"
        ) {
            data.name = "Pengguna";
        }

        if (
            typeof data.point !== "number"
        ) {
            data.point = 0;
        }

        if (
            !Array.isArray(data.quests)
        ) {
            data.quests = [];
        }

        data.quests.forEach(
            function (quest) {

                if (
                    typeof quest.id ===
                    "undefined"
                ) {
                    quest.id =
                        Date.now() +
                        Math.random();
                }

                if (
                    typeof quest.points !==
                    "number"
                ) {
                    quest.points = 0;
                }

                if (
                    typeof quest.reward !==
                    "string"
                ) {
                    quest.reward = "";
                }

                if (
                    typeof quest.completed !==
                    "boolean"
                ) {
                    quest.completed = false;
                }

                if (
                    typeof quest.createdAt !==
                    "number"
                ) {
                    quest.createdAt =
                        Date.now();
                }

                if (
                    typeof quest.failed !==
                    "boolean"
                ) {
                    quest.failed = false;
                }

                if (
                    typeof quest.performanceEnabled !==
                    "boolean"
                ) {
                    quest.performanceEnabled =
                        false;
                }

                if (
                    typeof quest.performanceCurrent !==
                    "number"
                ) {
                    quest.performanceCurrent = 0;
                }

                if (
                    typeof quest.performanceTarget !==
                    "number"
                ) {
                    quest.performanceTarget = 0;
                }

            }
        );

        return data;

    } catch (error) {

        console.error(
            "Gagal membaca account:",
            error
        );

        return null;
    }

}


/* ==================================================
   SAVE ACCOUNT
   ================================================== */

function saveAccount() {

    if (!account) {
        return;
    }

    try {

        localStorage.setItem(
            "questAccount",
            JSON.stringify(account)
        );

    } catch (error) {

        console.error(
            "Gagal menyimpan account:",
            error
        );

        showNotification(
            "ERROR",
            "Data gagal disimpan."
        );

    }

}


/* ==================================================
   SCREEN
   ================================================== */

function showScreen(screen) {

    const screens = [
        homeScreen,
        accountScreen,
        mainScreen,
        folderScreen
    ];

    screens.forEach(
        function (item) {

            if (item) {
                item.classList.add("hidden");
            }

        }
    );

    if (screen) {
        screen.classList.remove("hidden");
    }

}


/* ==================================================
   START
   ================================================== */

document
    .getElementById("startBtn")
    .addEventListener(
        "click",
        function () {

            if (!account) {

                document
                    .getElementById(
                        "accountWarning"
                    )
                    .classList.remove(
                        "hidden"
                    );

                showNotification(
                    "Bikin Account dulu ya!",
                    "Silahkan Buat akun untuk langkah selajutnya."
                );

                return;
            }

            openFolder();

        }
    );


/* ==================================================
   CREATE ACCOUNT BUTTON
   ================================================== */

document
    .getElementById("accountBtn")
    .addEventListener(
        "click",
        function () {

            showScreen(accountScreen);

            document
                .getElementById(
                    "accountWarning"
                )
                .classList.add(
                    "hidden"
                );

        }
    );


/* ==================================================
   BACK ACCOUNT
   ================================================== */

document
    .getElementById("backAccountBtn")
    .addEventListener(
        "click",
        function () {

            showScreen(homeScreen);

        }
    );


/* ==================================================
   CREATE ACCOUNT
   ================================================== */

document
    .getElementById("createAccountBtn")
    .addEventListener(
        "click",
        function () {

            const input =
                document.getElementById(
                    "nameInput"
                );

            const name =
                input.value.trim();


            if (name === "") {

                showNotification(
                    "Nama belum diisi!",
                    "Silakan masukkan nama pengguna."
                );

                return;
            }


            account = {

                name: name,

                point: 0,

                quests: []

            };


            saveAccount();


            input.value = "";


            showNotification(
                "Account berhasil dibuat!",
                "Selamat datang, " + name
            );


            openFolder();

        }
    );


/* ==================================================
   OPEN FOLDER
   ================================================== */

function openFolder() {

    if (!account) {
        return;
    }

    showScreen(folderScreen);

    checkQuestReset();

    renderFolder();

}


/* ==================================================
   BACK MAIN
   ================================================== */

document
    .getElementById("backMainBtn")
    .addEventListener(
        "click",
        function () {

            openFolder();

        }
    );


/* ==================================================
   PERFORMANCE ELEMENT
   ================================================== */

const performanceToggle =
    document.getElementById(
        "performanceToggle"
    );

const performanceInputBox =
    document.getElementById(
        "performanceInputBox"
    );

const performanceTargetInput =
    document.getElementById(
        "performanceTargetInput"
    );


const modalPerformanceToggle =
    document.getElementById(
        "modalPerformanceToggle"
    );

const modalPerformanceInputBox =
    document.getElementById(
        "modalPerformanceInputBox"
    );

const modalPerformanceTargetInput =
    document.getElementById(
        "modalPerformanceTargetInput"
    );


/* ==================================================
   PERFORMANCE TOGGLE
   ================================================== */

if (performanceToggle) {

    performanceToggle.addEventListener(
        "change",
        function () {

            if (this.checked) {

                performanceInputBox
                    .classList
                    .remove("hidden");

            } else {

                performanceInputBox
                    .classList
                    .add("hidden");

                performanceTargetInput.value = "";

            }

        }
    );

}


if (modalPerformanceToggle) {

    modalPerformanceToggle.addEventListener(
        "change",
        function () {

            if (this.checked) {

                modalPerformanceInputBox
                    .classList
                    .remove("hidden");

            } else {

                modalPerformanceInputBox
                    .classList
                    .add("hidden");

                modalPerformanceTargetInput.value = "";

            }

        }
    );

}


/* ==================================================
   SAVE QUEST FROM MAIN
   ================================================== */

document
    .getElementById("saveQuestBtn")
    .addEventListener(
        "click",
        function () {

            const performanceEnabled =
                performanceToggle.checked;

            const performanceTarget =
                performanceTargetInput.value;


            createQuest(

                document
                    .getElementById(
                        "questInput"
                    )
                    .value,

                document
                    .getElementById(
                        "pointInput"
                    )
                    .value,

                document
                    .getElementById(
                        "textRewardInput"
                    )
                    .value,

                performanceEnabled,

                performanceTarget

            );

        }
    );


/* ==================================================
   ADD QUEST BUTTON
   ================================================== */

document
    .getElementById("addQuestBtn")
    .addEventListener(
        "click",
        function () {

            resetModal();

            questModal
                .classList
                .remove("hidden");

        }
    );


/* ==================================================
   CLOSE MODAL
   ================================================== */

document
    .getElementById("closeModalBtn")
    .addEventListener(
        "click",
        function () {

            questModal
                .classList
                .add("hidden");

        }
    );


/* ==================================================
   ADD QUEST FROM MODAL
   ================================================== */

document
    .getElementById("addToFolderBtn")
    .addEventListener(
        "click",
        function () {

            const performanceEnabled =
                modalPerformanceToggle.checked;

            const performanceTarget =
                modalPerformanceTargetInput.value;


            createQuest(

                document
                    .getElementById(
                        "modalQuestInput"
                    )
                    .value,

                document
                    .getElementById(
                        "modalPointInput"
                    )
                    .value,

                document
                    .getElementById(
                        "modalTextRewardInput"
                    )
                    .value,

                performanceEnabled,

                performanceTarget

            );

        }
    );


/* ==================================================
   CREATE QUEST
   ================================================== */

function createQuest(
    questText,
    pointValue,
    textReward,
    performanceEnabled,
    performanceTarget
) {

    questText =
        String(questText || "").trim();

    pointValue =
        String(pointValue || "").trim();

    textReward =
        String(textReward || "").trim();

    performanceTarget =
        String(
            performanceTarget || ""
        ).trim();


    /* ---------- QUEST ---------- */

    if (questText === "") {

        showNotification(
            "Quest belum diisi!",
            "ENTER QUEST wajib diisi."
        );

        return;
    }


    /* ---------- REWARD ---------- */

    if (
        pointValue === "" &&
        textReward === ""
    ) {

        showNotification(
            "Reward belum diisi!",
            "Isi Point atau Teks Rewards."
        );

        return;
    }


    /* ---------- POINT ---------- */

    let points = 0;


    if (pointValue !== "") {

        points =
            Number(pointValue);


        if (
            !Number.isFinite(points) ||
            points < 0
        ) {

            showNotification(
                "Point tidak valid!",
                "NUMBER POINT harus angka 0 atau lebih."
            );

            return;
        }

    }


    /* ---------- PERFORMANCE ---------- */

    let target = 0;


    if (performanceEnabled) {

        if (performanceTarget === "") {

            showNotification(
                "Target Kinerja belum diisi!",
                "Masukkan jumlah target."
            );

            return;
        }


        target =
            Number(performanceTarget);


        if (
            !Number.isInteger(target) ||
            target < 1
        ) {

            showNotification(
                "Target Kinerja tidak valid!",
                "Target minimal adalah 2."
            );

            return;
        }

    }


    /* ---------- CREATE OBJECT ---------- */

    const quest = {

        id:
            Date.now() +
            Math.random(),

        text:
            questText,

        points:
            points,

        reward:
            textReward,

        completed:
            false,

        createdAt:
            Date.now(),

        failed:
            false,

        performanceEnabled:
            performanceEnabled === true,

        performanceCurrent:
            0,

        performanceTarget:
            target

    };


    account.quests.push(quest);


    saveAccount();


    resetCreateForm();


    questModal
        .classList
        .add("hidden");


    renderFolder();


    showNotification(
        "Quest berhasil disimpan!",
        "+" +
        points +
        " Point tersedia"
    );

}


/* ==================================================
   RESET CREATE FORM
   ================================================== */

function resetCreateForm() {

    document
        .getElementById(
            "questInput"
        )
        .value = "";

    document
        .getElementById(
            "pointInput"
        )
        .value = "";

    document
        .getElementById(
            "textRewardInput"
        )
        .value = "";


    if (performanceToggle) {

        performanceToggle.checked = false;

    }

    if (performanceInputBox) {

        performanceInputBox
            .classList
            .add("hidden");

    }

    if (performanceTargetInput) {

        performanceTargetInput.value = "";

    }

}


/* ==================================================
   RESET MODAL
   ================================================== */

function resetModal() {

    document
        .getElementById(
            "modalQuestInput"
        )
        .value = "";

    document
        .getElementById(
            "modalPointInput"
        )
        .value = "";

    document
        .getElementById(
            "modalTextRewardInput"
        )
        .value = "";


    modalPerformanceToggle.checked = false;

    modalPerformanceInputBox
        .classList
        .add("hidden");

    modalPerformanceTargetInput.value = "";

}


/* ==================================================
   RENDER FOLDER
   ================================================== */

function renderFolder() {

    if (!account) {
        return;
    }


    document
        .getElementById(
            "userName"
        )
        .textContent =
        account.name;


    document
        .getElementById(
            "totalPoint"
        )
        .textContent =
        account.point;


    document
        .getElementById(
            "folderName"
        )
        .textContent =
        account.name;


    document
        .getElementById(
            "folderPoint"
        )
        .textContent =
        account.point;


    const list =
        document.getElementById(
            "missionList"
        );


    list.innerHTML = "";


    let completedCount = 0;


    account.quests.forEach(
        function (quest) {

            if (quest.completed) {

                completedCount++;

            }


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "questCard";


            /* ---------- PERFORMANCE ---------- */

            let performanceHTML = "";


            if (
                quest.performanceEnabled
            ) {

                const complete =
                    quest.performanceCurrent >=
                    quest.performanceTarget;


                performanceHTML = `

                    <div class="questPerformance
                        ${
                            complete
                            ? "questPerformanceComplete"
                            : ""
                        }">

                        Tugas:
                        ${quest.performanceCurrent}/${quest.performanceTarget}

                    </div>

                `;

            }


            /* ---------- LOCK ---------- */

            let lockHTML = "";


            if (
                quest.performanceEnabled &&
                !quest.completed &&
                quest.performanceCurrent <
                quest.performanceTarget
            ) {

                lockHTML = `

                    <div class="questLocked">

                        ⚠ Tugas belum mencapai target

                    </div>

                `;

            }


            /* ---------- CLAIM ---------- */

            let claimHTML = "";


            if (quest.completed) {

                claimHTML = `

                    <div class="claimSuccess">

                        ✔ CLAIM BERHASIL

                    </div>

                `;

            }


            /* ---------- CARD ---------- */

            card.innerHTML = `

                <div class="questRow">

                    <input
                        type="checkbox"
                        class="questCheck"
                        ${
                            quest.completed
                            ? "checked"
                            : ""
                        }
                    >

                    <span class="questName
                        ${
                            quest.completed
                            ? "questDone"
                            : ""
                        }">

                        ${escapeHTML(quest.text)}

                    </span>

                </div>


                <div class="questPoint">

                    Point: ${quest.points}

                </div>


                ${
                    quest.reward
                    ?
                    `
                    <div class="questReward">

                        Reward:
                        ${escapeHTML(quest.reward)}

                    </div>
                    `
                    :
                    ""
                }


                ${performanceHTML}

                ${lockHTML}

                ${claimHTML}

            `;


            const checkbox =
                card.querySelector(
                    ".questCheck"
                );


            checkbox.addEventListener(
                "change",
                function () {

                    toggleQuest(
                        quest.id,
                        this.checked
                    );

                }
            );


            list.appendChild(card);

        }
    );


    document
        .getElementById(
            "performance"
        )
        .textContent =
        completedCount +
        "/" +
        account.quests.length;

}


/* ==================================================
   TOGGLE QUEST
   ================================================== */

function toggleQuest(
    id,
    checked
) {

    if (!account) {
        return;
    }


    const quest =
        account.quests.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!quest) {
        return;
    }


    /* ==================================================
       CHECK
       ================================================== */

    if (
        checked &&
        !quest.completed
    ) {


        /* ---------- PERFORMANCE QUEST ---------- */

        if (quest.performanceEnabled) {

            if (
                quest.performanceCurrent <
                quest.performanceTarget
            ) {

                quest.performanceCurrent++;


                /* ---------- TARGET BELUM TERCAPAI ---------- */

                if (
                    quest.performanceCurrent <
                    quest.performanceTarget
                ) {

                    saveAccount();

                    renderFolder();

                    showNotification(
                        "Kinerja bertambah!",
                        quest.performanceCurrent +
                        "/" +
                        quest.performanceTarget
                    );

                    return;
                }


                /* ---------- TARGET TERCAPAI ---------- */

                quest.completed = true;

                account.point +=
                    quest.points;


                saveAccount();

                renderFolder();


                showNotification(
                    "Quest Selesai!",
                    "+" +
                    quest.points +
                    " Point"
                );


                checkAllCompleted();

                return;
            }

        }


        /* ---------- QUEST NORMAL ---------- */

        quest.completed = true;

        account.point +=
            quest.points;


        saveAccount();

        renderFolder();


        showNotification(
            "Quest Selesai!",
            "+" +
            quest.points +
            " Point"
        );


        checkAllCompleted();

        return;
    }


    /* ==================================================
       UNCHECK
       ================================================== */

    if (
        !checked &&
        quest.completed
    ) {

        quest.completed = false;


        account.point -=
            quest.points;


        /*
         * Kembalikan progress
         * satu langkah jika Performance aktif.
         */

        if (
            quest.performanceEnabled &&
            quest.performanceCurrent > 0
        ) {

            quest.performanceCurrent--;

        }


        /* Jangan biarkan point menjadi minus
           karena pembatalan. */

        if (account.point < 0) {

            account.point = 0;

        }


        saveAccount();

        renderFolder();


        showNotification(
            "Quest dibatalkan",
            "-" +
            quest.points +
            " Point"
        );

    }

}


/* ==================================================
   ALL QUEST COMPLETE
   ================================================== */

function checkAllCompleted() {

    if (!account) {
        return;
    }


    if (
        account.quests.length === 0
    ) {
        return;
    }


    const allComplete =
        account.quests.every(
            function (quest) {

                return quest.completed;

            }
        );


    if (!allComplete) {
        return;
    }


    const gained =
        account.quests.reduce(
            function (sum, quest) {

                return sum + quest.points;

            },
            0
        );


    showNotification(
        "Selamat hari yang anda jalani tidak sia - sia",
        "+" +
        gained +
        " Point"
    );


    sendPhoneNotification(
        "Selamat hari yang anda jalani tidak sia - sia",
        "+" +
        gained +
        " Point"
    );

}


/* ==================================================
   24 HOUR RESET
   ================================================== */

function checkQuestReset() {

    if (!account) {
        return;
    }


    const now =
        Date.now();


    const DAY =
        24 *
        60 *
        60 *
        1000;


    let changed = false;

    let unfinished = 0;


    account.quests.forEach(
        function (quest) {

            if (
                now -
                quest.createdAt <
                DAY
            ) {

                return;
            }


            /* ---------- BELUM SELESAI ---------- */

            if (
                !quest.completed &&
                !quest.failed
            ) {

                account.point -=
                    quest.points;

                quest.failed = true;

                unfinished++;

            }


            /* ---------- RESET ---------- */

            quest.completed = false;

            quest.failed = false;

            quest.performanceCurrent = 0;

            quest.createdAt = now;

            changed = true;

        }
    );


    /* ---------- POINT SAFETY ---------- */

    if (account.point < 0) {

        account.point = 0;

    }


    if (!changed) {
        return;
    }


    saveAccount();

    renderFolder();


    /* ---------- DAILY RESULT ---------- */

    if (unfinished > 5) {

        showNotification(
            "Selamat hari yang anda jalani telah Rusak oleh anda sendiri",
            "-" +
            unfinished +
            " Quest"
        );

    }

    else if (unfinished > 0) {

        showNotification(
            "Hidup anda membosankan",
            "-" +
            unfinished +
            " Quest"
        );

    }

}


/* ==================================================
   DELETE FOLDER
   ================================================== */

document
    .getElementById(
        "deleteFolderBtn"
    )
    .addEventListener(
        "click",
        function () {

            if (!account) {
                return;
            }


            const confirmDelete =
                confirm(
                    "Hapus semua Quest dan Account?"
                );


            if (!confirmDelete) {
                return;
            }


            localStorage.removeItem(
                "questAccount"
            );


            account = null;


            questModal
                .classList
                .add("hidden");


            showScreen(homeScreen);


            document
                .getElementById(
                    "accountWarning"
                )
                .classList
                .add("hidden");


            showNotification(
                "Folder dihapus",
                "Semua data telah dihapus."
            );

        }
    );


/* ==================================================
   NOTIFICATION
   ================================================== */

function showNotification(
    title,
    message
) {

    const box =
        document.getElementById(
            "notification"
        );


    const titleElement =
        document.getElementById(
            "notificationTitle"
        );


    const pointElement =
        document.getElementById(
            "notificationPoint"
        );


    titleElement.textContent =
        title;


    pointElement.textContent =
        message;


    box.classList.remove(
        "hidden"
    );


    if (notificationTimer) {

        clearTimeout(
            notificationTimer
        );

    }


    notificationTimer =
        setTimeout(
            function () {

                box.classList.add(
                    "hidden"
                );

            },
            5000
        );

}


/* ==================================================
   PHONE NOTIFICATION
   ================================================== */

function sendPhoneNotification(
    title,
    message
) {

    if (
        !("Notification" in window)
    ) {

        return;
    }


    if (
        Notification.permission ===
        "granted"
    ) {

        new Notification(
            title,
            {
                body: message
            }
        );

        return;
    }


    if (
        Notification.permission ===
        "denied"
    ) {

        return;
    }


    Notification
        .requestPermission()
        .then(
            function (permission) {

                if (
                    permission ===
                    "granted"
                ) {

                    new Notification(
                        title,
                        {
                            body: message
                        }
                    );

                }

            }
        )
        .catch(
            function (error) {

                console.log(
                    "Notification tidak tersedia:",
                    error
                );

            }
        );

}


/* ==================================================
   ESCAPE HTML
   ================================================== */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(text);


    return div.innerHTML;

}


/* ==================================================
   AUTO CHECK
   ================================================== */

setInterval(
    function () {

        checkQuestReset();

    },
    60 * 1000
);


/* ==================================================
   INITIAL LOAD
   ================================================== */

if (account) {

    renderFolder();

} else {

    showScreen(homeScreen);

}