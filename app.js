
const currentTab = document.querySelector('#current-page')
const mainInput = document.querySelector('#to-do-input')
const body = document.querySelector('body')
const listCon = document.querySelector('#list-con')
const viewProjectsBtn = document.querySelector('#all-projects')
const enterProject = document.querySelector('#enter-project')
const submitProject = document.querySelector('#submit-project')
const enterProjectWindow = document.querySelector('#project-con')
const projectListCon = document.querySelector('#project-list-con')
const projectList = document.querySelector('#project-list')
const searchInput = document.querySelector('#searchInput')
let projectName = document.querySelector('#project-name')
let deadline = document.querySelector('#deadline')
let notes = document.querySelector('#notes')
let description = document.querySelector('#description')
let AppBackGround = ''

let mustDoArr = []
let toDoArr = []
let doLatterArr = []

let data = JSON.parse(localStorage.getItem('mustDoArr'))
let data1 = JSON.parse(localStorage.getItem('toDoArr'))
let data2 = JSON.parse(localStorage.getItem('doLatterArr'))
let data3 = JSON.parse(localStorage.getItem('projectObj'))
let backgroundData = JSON.parse(localStorage.getItem('bg'))

const mustDoCount = document.querySelector('#mustDo-count')
const toDoCount = document.querySelector('#toDo-count')
const doLatterCount = document.querySelector('#doLatter-count')

mustDoCount.textContent = mustDoArr.length.toString()

function updateNumbers(count,arr) {
    count.textContent = arr.length.toString()
}

/* GET KEY FOR STORAGE SO I COULD UPDATE SPECIFIC LOCAL STORAGE ARRAY ON RE-RENDER */
let gotKey = ''
function getKeyForStorage(arr) {
    (arr === mustDoArr) ? (gotKey = 'mustDoArr') : (arr === toDoArr) ? (gotKey = 'toDoArr') : (gotKey = 'doLatterArr')
    return gotKey
}
function storeData(key,arr) {
    localStorage.setItem(key,JSON.stringify(arr))
}

window.addEventListener('DOMContentLoaded', () => {
    (data) ? (mustDoArr = [...data]) : false;
    (data1) ? (toDoArr = [...data1]) : false;
    (data2) ? (doLatterArr = [...data2]) : false;
    (data3) ? (projectObj = [...data3]) : false;
    (backgroundData) ? (AppBackGround = backgroundData) : false;
    currentBg()
    render(mustDoArr)
});

function changeClassOnItem(y ,x) {
    y.className = ''
    y.classList.add(x)
}

document.querySelector('#clear-all').addEventListener('click',() => {
    if (confirm('All app data will be reset')) {
        localStorage.clear()
        mustDoArr = []
        toDoArr = []
        doLatterArr = []
        projectObj = []
        renderProjectList(projectObj)
        render(mustDoArr)
    }
})

function currentBg() {
    (AppBackGround === 'first') ? (changeClassOnItem(body,'bg-1')) : (AppBackGround === 'second') ? (changeClassOnItem(body,'bg-2')) : (changeClassOnItem(body,'bg-3'))
    storeData('bg',AppBackGround)
}

document.querySelector('.side-bar-4').addEventListener('click',() => {
    AppBackGround = 'first'
    currentBg()
})
document.querySelector('.side-bar-5').addEventListener('click',() => {
    AppBackGround = 'second'
    currentBg()
})
document.querySelector('.side-bar-6').addEventListener('click',() => {
    AppBackGround = 'third'
    currentBg()
})

document.querySelectorAll('#must-do, #side-bar-1').forEach((el) => {
    el.addEventListener('click',() => {
        changeClassOnItem(currentTab, 'gold')
        render(mustDoArr)
        storeData('mustDoArr', mustDoArr)
    })
})
document.querySelectorAll('#to-do, #side-bar-2').forEach((el) => {
    el.addEventListener('click',() => {
        changeClassOnItem(currentTab,'green')
        render(toDoArr)
        storeData('toDoArr',toDoArr)
    })
})
document.querySelectorAll('#do-latter, #side-bar-3').forEach((el) => {
    el.addEventListener('click',() => {
        changeClassOnItem(currentTab,'blue')
        render(doLatterArr)
        storeData('doLatterArr',doLatterArr)
    })
})

function moveListUp(arr) {
    if (arr.length) {
        arr.push(arr.shift())
    }
}
function moveListDown(arr) {
    if (arr.length) {
        arr.unshift(arr.pop())
    }
}

function delItem(element,arr,divToRemove) {
    const index = arr.indexOf(element);
    arr.splice(index, 1);
    divToRemove.remove()
}

function moveItem(arr,element) {
    const index = arr.indexOf(element)
    const elToPush = arr.splice(index, 1)
    if (arr === mustDoArr) {
        toDoArr.push(elToPush[0])
        localStorage.setItem('toDoArr',JSON.stringify(toDoArr))
    } else if (arr === toDoArr) {
        doLatterArr.push(elToPush[0])
        localStorage.setItem('doLatterArr',JSON.stringify(doLatterArr))
    } else {
        mustDoArr.push(elToPush[0])
        localStorage.setItem('mustDoArr',JSON.stringify(mustDoArr))
    }
    render(arr)
}

function colorOnRefreshPage(arr,text) {
    (arr === mustDoArr) ? (text.classList.add('gold-bg')) : (arr === toDoArr) ? (text.classList.add('green-bg')) : (text.classList.add('blue-bg'))
}
function colorOnCheckClick(arr,text) {
    (arr === mustDoArr) ? (text.classList.toggle('gold-bg')) : (arr === toDoArr) ? (text.classList.toggle('green-bg')) : (text.classList.toggle('blue-bg'))
}
function arrowColor(arr,element) {
    (arr === mustDoArr) ? (element.className = 'fas fa-angle-double-right green') : (arr === toDoArr) ? (element.className = 'fas fa-angle-double-right blue') : (element.className = 'fas fa-angle-double-right gold')
}

function SortDate(arr,x,y) {
    arr.sort((a, b) => {
        if(a.date < b.date) { return x; }
        if(a.date > b.date) { return y; }
        return 0;
    })
    if (arr === projectObj) {
        renderProjectList(arr)
    } else {
        render(arr)
    }
}

function sortButtons(arr) {
    const sortHidden = document.querySelector('#sort-hidden')
    sortHidden.innerHTML = null
    const sortNewest = document.createElement('div')
    sortNewest.className = 'sort-btn'
    sortNewest.textContent = 'Newest'
    sortNewest.addEventListener('click',() => {
        SortDate(arr,-1,1)
    })
    const sortOldest = document.createElement('div')
    sortOldest.className = 'sort-btn'
    sortOldest.textContent = 'Oldest'
    sortOldest.addEventListener('click',() => {
        SortDate(arr,1,-1)
    })
    sortHidden.append(sortNewest,sortOldest)
}

function valuesOnInput(arr) {
    if (mainInput.value) {
        let valuesOnInput = {
            name: mainInput.value,
            date: new Date().toJSON().slice(5, 10),
            done: false
        }
        arr.push(valuesOnInput)
    }
}

function createEl(element,arr) {
    const div = document.createElement('div')
    div.className = 'item-wrapper'
    document.querySelector('#list-items-wrapper').append(div)
    const divSub = document.createElement('div')
    divSub.className = 'd-flex align-center'
    const divSub2 = document.createElement('div')
    divSub2.className = 'd-flex align-center'
    const checkBox = document.createElement('input')
    if (element.done === true) {
        checkBox.checked = true
    }
    checkBox.type = 'checkbox'
    checkBox.addEventListener('click', () => {
        colorOnCheckClick(arr, text)
        element.done = checkBox.checked;
        storeData(gotKey,arr)
    })
    const arrow = document.createElement('i')
    arrow.className = 'fas fa-angle-double-right'
    arrowColor(arr,arrow)
    arrow.addEventListener('click',() => {
        moveItem(arr,element)
    })
    const date = document.createElement('tag')
    date.textContent = element.date
    date.className = 'current-date'
    const text = document.createElement('p')
    text.className = 'text'
    text.textContent = element.name
    let bin = document.createElement('i')
    bin.addEventListener('click', () => {
        delItem(element, arr, div)
        getKeyForStorage(arr)
        storeData(gotKey, arr)
        updateNumbers(mustDoCount, mustDoArr)
        updateNumbers(toDoCount, toDoArr)
        updateNumbers(doLatterCount, doLatterArr)
    })
    bin.className = 'fas fa-trash-alt'
    divSub2.append(date,bin)
    divSub.append(checkBox,arrow)
    div.append(divSub,text,divSub2)
    if (element.done) {
        colorOnRefreshPage(arr,text)
    }
}

function render(arr) {
    listCon.classList.remove('display-none')
    projectListCon.classList.add('display-none')
    enterProjectWindow.classList.add('display-none')
    document.querySelector('#arrow-con').innerHTML = null
    createBottomArrows(arr)
    document.querySelector('#list-items-wrapper').innerHTML = null
    document.querySelector('#to-do-input').addEventListener('keyup',(e) => {
        if (e.keyCode === 13) {
            render(mustDoArr)
        }
    })
    valuesOnInput(arr)
    arr.forEach((el,index,arr) => {
        createEl(el,arr)
    })
    mainInput.value = ''
    sortButtons(arr)
    updateNumbers(mustDoCount,mustDoArr)
    updateNumbers(toDoCount,toDoArr)
    updateNumbers(doLatterCount,doLatterArr)
    getKeyForStorage(arr)
    storeData(gotKey,arr)
}

function createBottomArrows(arr) {
    const arrowUp = document.createElement('div')
    arrowUp.id = 'left-arrow-up'
    const arrowDown = document.createElement('div')
    arrowDown.id = 'left-arrow-ip'
    const arrowUpIcon = document.createElement('i')
    arrowUpIcon.className = 'fas fa-chevron-up'
    const arrowDownIcon = document.createElement('i')
    arrowDownIcon.className = 'fas fa-chevron-down'
    const arrowCon = document.querySelector('#arrow-con')
    arrowUp.append(arrowUpIcon)
    arrowDown.append(arrowDownIcon)
    arrowCon.append(arrowUp,arrowDown)
    arrowUp.addEventListener('click',() => {
        moveListUp(arr)
        render(arr)
    })
    arrowDown.addEventListener('click',() => {
        moveListDown(arr)
        render(arr)
    })
}

/* PROJECTS */

let projectObj = []
let searchObj = []

searchInput.addEventListener('keyup',(el) => {
    const searchValue = el.target.value.toLowerCase()
    searchObj = projectObj.filter(e => {
        return e.name.toLowerCase().includes(searchValue)
    })
    renderProjectList(searchObj)
})

function drawObjItems(arr,value) {
    const nameParagraph = document.createElement('p')
    const deadlineParagraph = document.createElement('p')
    const notesParagraph = document.createElement('p')
    const descriptionParagraph = document.createElement('p')
    const ProjectWrapper = document.createElement('div')
    ProjectWrapper.className = 'project-wrapper'
    const del = document.createElement('i')
    const delWrapper = document.createElement('div')
    delWrapper.className = 'd-flex space-between align-center'
    const edit = document.createElement('i')
    edit.className = 'far fa-edit project-edit'
    edit.addEventListener('click',() => {
        listCon.classList.add('display-none')
        projectListCon.classList.add('display-none')
        enterProjectWindow.classList.remove('display-none')
        projectName.value = value.name
        deadline.value = value.deadline
        notes.value = value.notes
        description.value = value.description
    })
    const date = document.createElement('p')
    date.className = 'current-date-projects'
    date.textContent = 'Date entered: ' + value.date
    del.className = 'delete-project fas fa-times'
    del.addEventListener('click', () => {
        delItem(value, arr, ProjectWrapper)
        storeData('projectObj', projectObj)
    })
    nameParagraph.className = 'text'
    deadlineParagraph.className = 'text'
    notesParagraph.className = 'text'
    descriptionParagraph.className = 'text'
    nameParagraph.textContent = 'Project name: ' + value.name
    deadlineParagraph.textContent = 'Deadline: ' + value.deadline
    notesParagraph.textContent = 'Notes: ' + value.notes
    descriptionParagraph.textContent = 'Description: ' + value.description
    delWrapper.append(edit,date,del)
    ProjectWrapper.append(delWrapper, nameParagraph, deadlineParagraph, notesParagraph, descriptionParagraph)
    projectList.append(ProjectWrapper)
}

function renderProjectList(arr) {
    projectList.innerHTML = null
    document.querySelector('#arrow-con').innerHTML = null
    sortButtons(arr)
    arr.forEach((value) => {
        drawObjItems(arr,value)
    })
}

enterProject.addEventListener('click',() => {
    listCon.classList.add('display-none')
    projectListCon.classList.add('display-none')
    enterProjectWindow.classList.remove('display-none')
})
viewProjectsBtn.addEventListener('click',() => {
    listCon.classList.add('display-none')
    enterProjectWindow.classList.add('display-none')
    projectListCon.classList.remove('display-none')
    renderProjectList(projectObj)
})

function allFieldsRequiredMessage() {
    const message = document.createElement('p')
    message.textContent = 'Please fill all fields'
    document.querySelector('#fillAllFields').append(message)
}

submitProject.addEventListener('click',() => {
    document.querySelector('#fillAllFields').textContent = null
    const entry = {
        name: projectName.value,
        deadline: deadline.value,
        notes: notes.value,
        description: description.value,
        date: new Date().toJSON().slice(0, 10)
    }
    const allTrue = Object.keys(entry).every((k) => {return entry[k]});

    if (allTrue) {
        projectObj.push(entry)
        projectName.value = ''
        deadline.value = ''
        notes.value = ''
        description.value = ''
    } else {
        allFieldsRequiredMessage()
    }
    storeData('projectObj',projectObj)
})










