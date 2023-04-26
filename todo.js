var todolistapp = (function () {
  let tasks = [];
  let initialFooter = document.getElementById("footer");
  initialFooter.style.opacity = 0;
  const taskList = document.getElementById("list");
  const addTaskInput = document.getElementById("add");
  const tasksCounter = document.getElementById("tasks-counter");
  let i = 0;



  function addItemToDOM(task) {
    i++;
    let li = document.createElement("li");
    li.innerHTML = `<input type="checkbox" id="${task.id}" ${
      task.done ? "checked" : ""
    } class="custom-checkbox">
          <label for="${task.id}">${task.text}</label>`;
    taskList.append(li);
    li.classList.add("list");
    li.id = i;
    mouseovercrossdisplay(task.id, i);
  }



  function renderList(present_tasks) {
    taskList.innerHTML = "";
    for (var i = 0; i < present_tasks.length; i++) {
      addItemToDOM(present_tasks[i]);
    }
    tasksCounter.innerHTML = tasks.length;
  }



  function addTask(task) {
    if (task) {
      tasks.push(task);
      renderList(tasks);
      let newtask = document.getElementById(task.id).parentNode;
      let addtask = document.getElementById("add");
      let initial = -10;
      newtask.style.top = initial + "px";
      newtask.style.opacity = 0;
      let op = 0;
      let movement = setInterval(function () {
        initial++;
        newtask.style.top = initial + "px";
        op = op + 0.1;
        newtask.style.opacity = op;
        if (initial == 0) {
          clearInterval(movement);
        }
      }, 50);
      completepercentage();
      if (initialFooter.style.opacity == 0) {
        initialFooter.style.opacity = 1;
      }
    }

  }



  function deleteTask(taskId) {
    let li = document.getElementById(taskId).parentElement;
    li.style.left = 0 + "px";
    var op = 1;
    li.style.opacity = op;
    var lef = parseInt(li.style.left);
    let movement = setInterval(function () {
      lef--;
      li.style.left = lef;
      op = op - 0.01;
      li.style.opacity = op;
      if (op <= 0) {
        clearInterval(movement);
        deleted();
      }
    }, 1);
    function deleted() {
      const newtask = tasks.filter(function (task) {
        return Number(taskId) != task.id;
      });
      tasks = newtask;
      renderList(tasks);
      completepercentage();
    }
  }





  function markTaskAsComplete(taskId) {
    const task = tasks.filter((task) => {
      return Number(task.id) === Number(taskId);
    });
    if (task.length > 0) {
      const currentTask = task[0];
      currentTask.done = !currentTask.done;
      renderList(tasks);
      showNotification("successfully completed task");
      completepercentage();
      return;
    }
    showNotification("fail to toggle");
  }


  function show_certain(showid) {
    if (showid === "present_all") {
      renderList(tasks);
    } else if (showid === "present_attempt") {
      let presentlist = tasks.filter(function (task) {
        return task.done == true;
      });
      renderList(presentlist);
    } else if (showid === "present_unattempted") {
      let presentlist = tasks.filter(function (task) {
        return task.done == false;
      });
      renderList(presentlist);
    }
  }



  function completepercentage() {
    let c = 0;
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].done) {
        c++;
      }
    }
    let bar;
    if (tasks.length > 0) {
      bar = (c / tasks.length) * 100;
    } else {
      bar = 0;
    }
    let fillpercent = document.getElementById("fill");
    let container = document.getElementById("success");
    let currentcent = (fillpercent.clientWidth / container.clientWidth) * 100;
    let currentwidth = currentcent;
    console.log(currentcent, bar);
    if (currentcent >= bar) {
      let movement = setInterval(function () {
        fillpercent.innerHTML = Math.floor(currentwidth) + "%";
        fillpercent.style.width = currentwidth + "%";
        currentwidth--;
        if (bar >= currentwidth) {
          clearInterval(movement);
        }
      }, 10);
    }
    if (currentcent < bar) {
      let movement = setInterval(function () {
        currentwidth++;
        fillpercent.innerHTML = Math.floor(currentwidth) + "%";
        fillpercent.style.width = currentwidth + "%";
        if (bar <= currentwidth) {
          clearInterval(movement);
        }
      }, 10);
    }
  }
  


  function mouseovercrossdisplay(tasid, listid) {
    let listhover = document.getElementById(listid + "");
    var elem = document.createElement("img");
    Object.assign(elem, {
      className: "delete",
      src: "xmark-solid.svg",
      id: listid,
    });
    listhover.append(elem);
    elem.style.opacity = 0;
    elem.setAttribute("data-id", tasid);
    listhover.addEventListener("mouseover", function (e) {
      elem.style.opacity = 1;
    });
    listhover.addEventListener("mouseout", function () {
      elem.style.opacity = 0;
    });
  }






  function mouseoverevent(e) {
    if (e.target.className === "delete") {
      let currentlist = document.getElementById(e.target.parentElement.id);
      var i = 100;
      var movement = setInterval(function () {
        if (i > 0) {
          i = i - 5;
          currentlist.style.backgroundImage =
            "linear-gradient(to right, rgba(255, 255, 255, 0) " + i + "%,red)";
        }
      }, 50);
      document
        .getElementById(e.target.id)
        .addEventListener("mouseout", function (e) {
          clearInterval(movement);
          let innermov = setInterval(function () {
            i = i + 5;
            if (i < 100) {
              currentlist.style.backgroundImage =
                "linear-gradient(to right, rgba(255, 255, 255, 0) " +
                i +
                "%,red)";
            }
            if (i >= 100) {
              clearInterval(innermov);
              currentlist.style.backgroundImage = "none";
            }
          }, 50);
        });
    }
  }
  

  function showNotification(text) {
    alert(text);
  }


  function clearcompleted() {
    let completed = tasks.filter(function (task) {
      return !task.done;
    });
    tasks = completed;
    completepercentage();
    renderList(tasks);
  }


  function completeall() {
    for (let i = 0; i < tasks.length; i++) {
      tasks[i].done = true;
    }
    renderList(tasks);
    completepercentage();
  }


  function handleInputKeyPress(e) {
    if (e.key === "Enter") {
      const text = e.target.value;
      if (!text) {
        showNotification("task field can't empty");
        return;
      }
      const task = {
        text,
        id: Date.now().toString(),
        done: false,
      };
      e.target.value = "";
      addTask(task);
    }
  }



  function handleClickEvent(e) {
    if (e.target.className === "delete") {
      const eventid = e.target.dataset.id;
      deleteTask(eventid);
      return;
    } else if (e.target.className === "custom-checkbox") {
      const eventid = e.target.id;
      markTaskAsComplete(eventid);
      return;
    } else if (
      e.target.id === "present_all" ||
      e.target.id === "present_attempt" ||
      e.target.id === "present_unattempted"
    ) {
      const eventid = e.target.id;
      show_certain(eventid);
    } else if (e.target.className == "completedclear") {
      clearcompleted();
    } else if (e.target.className == "completed") {
      completeall();
    }
  }
  function initialiseapp() {
    addTaskInput.addEventListener("keyup", handleInputKeyPress);
    document.addEventListener("click", handleClickEvent);
    document.addEventListener("mouseover", mouseoverevent);
  }
  return {
    initialise: initialiseapp,
  };
})();
