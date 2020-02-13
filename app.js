// Storage Controller

// Item Controller
const ItemCtrl = (function() {
  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id
    this.name = name
    this.calories = calories
  }

  // Data Structure / State
  const data = {
    items: [],
    currentItem: null,
    totalCalories: 0
  }

  return {
    getItems: () => data.items,
    addItem: (name, calories) => {
      let ID
      // Create id
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1
      } else {
        ID = 0
      }

      //   Calories to numbers
      calories = parseInt(calories)

      //   Create New Item
      let newItem = new Item(ID, name, calories)

      //   Add To Items array
      data.items.push(newItem)

      return newItem
    },
    getTotalCalories: () => {
      let total = 0

      data.items.forEach(item => {
        total += item.calories
      })

      //   Set total cal in data structure
      data.totalCalories = total

      //   Return total
      return data.totalCalories
    },
    logData: () => data
  }
})()

// UIController
const UICtrl = (function() {
  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }

  return {
    populateItemList: items => {
      let html = ''

      items.forEach(item => {
        html += `
                <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
                </li>
        `
      })

      //   Insert List Items
      document.querySelector(UISelectors.itemList).innerHTML = html
    },
    getItemInput: () => ({
      name: document.querySelector(UISelectors.itemNameInput).value,
      calories: document.querySelector(UISelectors.itemCaloriesInput).value
    }),
    addListItem: item => {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block'
      // Create li element
      const li = document.createElement('li')
      li.className = 'collection-item'
      li.id = `item-${item.id}`

      // Add HTML
      li.innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>
        `
      // INSERT ITEM
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement('beforeend', li)
    },
    hideList: () => {
      document.querySelector(UISelectors.itemList).style.display = 'none'
    },
    clearInput: () => {
      document.querySelector(UISelectors.itemNameInput).value = ''
      document.querySelector(UISelectors.itemCaloriesInput).value = ''
    },
    showTotalCalories: totalCalories => {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories
    },
    getSelectors: () => UISelectors
  }
})()

// App Controler
const App = (function(ItemCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = () => {
    const UISelectors = UICtrl.getSelectors()

    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener('click', ItemAddSubmit)
  }

  //  Add item submit
  const ItemAddSubmit = e => {
    //   Get Form Input From UICtrl
    const input = UICtrl.getItemInput()

    // Check for name an calories input
    if (input.name !== '' && input.calories !== '') {
      // Add Item
      const newItem = ItemCtrl.addItem(input.name, input.calories)

      //   Add item to ui list
      UICtrl.addListItem(newItem)

      // Get the total calories
      const totalCalories = ItemCtrl.getTotalCalories()

      //   Add total calories to UI
      UICtrl.showTotalCalories(totalCalories)

      // Clear fields
      UICtrl.clearInput()
    }

    e.preventDefault()
  }

  return {
    init: () => {
      const items = ItemCtrl.getItems()

      //   Check if any items
      if (items.length === 0) {
        UICtrl.hideList()
      } else {
        UICtrl.populateItemList(items)
      }

      // Get the total calories
      const totalCalories = ItemCtrl.getTotalCalories()

      //   Add total calories to UI
      UICtrl.showTotalCalories(totalCalories)

      // Load event listeners
      loadEventListeners()
    }
  }
})(ItemCtrl, UICtrl)

// Initialize App
App.init()
