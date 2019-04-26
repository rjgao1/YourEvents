(function() {
  /**
   * variables
   */
  var user_id = '1111';
  var user_fullname = 'John';
  var lng = -122.08;
  var lat = 37.38;

  /**
   * Initialize
   */
  function init() {
    // Register event listeners
    $('nearby-btn').addEventListener('click', laodNearbyItems);
    $('fav-btn').addEventListener('click', laodFavoriteItems);
    $('recommend-btn').addEventListener('click', laodRecommendedItems);

    var welcomeMsg = $('welcome-msg');
    welcomeMsg.innerHTML = 'welcome, ' + user_fullname;
    initGeoLocation();
  }

  //TODO:
  function initGeoLocation() {

  }

  // ------------------
  // Helper Functions
  // ------------------

  /**
   * A helper function that makes a navigation button active
   * @param btnId -
   *          ID of the navigation button
   */
  function activateBtn(btnId) {
    var btns = document.getElementsByClassName('main-nav-btn');

    // deactivate all nav buttons 
    for (var i = 0; i < btns.length; i++) {
      btns[i].className = btns[i].className.replace(/\bactivate\b/, '');
    }

    // activate the button with btnId
    var btn = $(btnId);
    btn.className += ' activate';

  }

  //TODO
  function showLoadingMsg(msg) {
    var itemList = $('item-list');
    itemList.innerHTML = '<p class="notice"><i class="fa fa-spinner fa-spin"></i>' +
                          msg + 
                          '</p>';
  }

  //TODO
  function showWarningMsg(msg) {
    var itemList = $('item-list');
    itemList.innerHTML = '<p class="notcie"><i class="fa fa-exclamation-traingle"></i>' +
                          msg +
                          '</p>';
  }

  //TODO
  function showErrorMsg(msg) {
    var itemList = $('item-list');
    itemList.innerHTML = '<p class="notice"><i class="fa fa-exclamation-circle"></i>' +
                          msg +
                          '</p>';
  }

  /**
   * Helper function that creates a DOM element <tag, options...>
   * 
   * @param tag
   * @param options
   * @returns
   */
  function $(tag, options) {
    if (!options) {
      return document.getElementById(tag);
    }

    var element = document.createElement(tag);

    for (var option in options) {
      if (options.hasOwnProperty(option)) {
        element[option] = options[option];
      }
    }

    return element;
  }

  function hideElement(element) {
    element.style.display = 'none'; 
  }

  function showElement(element, style) {
    var displayStyle = style ? style : 'block';
    element.style.display = displayStyle;
  }

  /**
   * AJAX Helper
   * 
   * @param method - 
   *          GET|POST|PUT|DELETE
   * @param url -
   *          API endpoint
   * @param data
   * 
   * @param callback - 
   *          Successful callback
   * @param errorHandler - 
   *          Failed callback
   */
  function ajax(method, url, data, callback, errorHander) {
    var xhr = new XMLHttpRequest();
    
    xhr.open(method, url, true);

    //TDODO: onload
    xhr.onload = function() {
      if (xhr.status == 200) { //Successful
        callback(xhr.responseText);
      } else { //Failed
        errorHandler();
      }
    }

    //TODO: onerror
    xhr.onerror = function() {
      console.error("The request could not be completed!");
      errorHandler();
    }

    if (data == null) {
      xhr.send();
    } else {
      xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
      xhr.send(data);
    }

    // -------------------------------------
    // AJAX call server-side APIs
    // -------------------------------------

    /**
     * API #1
     * Load the nearby items
     * API endpoint: [GET] /search?user_id=1111&lat=37.38&lon=-122.08
     */
    function laodNearbyItems() {
      console.log('loadNearbyItems');
      activateBtn('nearby-btn');
      
      // Request parameters
      var url = './search';
      var params = 'user_id=' + user_id + 'lat' + lat + 'lon' + lng;
      var req = JSON.stringify({});

      // Display loading message
      showLoadingMsg("Loading nearby items...");

      // Make AJAX call
      ajax('GET', url + '?' + params, req, 
        // Successful callback
        function(res) {
          var items = JSON.parse(res);
          if (!items || items.length === 0) {
            showWarningMsg("No nearby item.");
          } else {
            itemList(items);
          }
        }, 
        // Failed callback
        function() {
          showErrorMsg("Cannot load nearby items.");
        }
      );
    }

    /**
     * API #2
     * Load favorite (or visited) items 
     * API endpoint: [GET] /history?user_id=1111
     */
    function laodFavoriteItems() {
      activateBtn('fav-btn');

      // Request parameters
      var url = './history';
      var params = 'user_id=' + user_id;
      var req = JSON.stringify({});

      // Display loading message
      showLoadingMsg("Loading favorite items...");

      // Make AJAX call
      ajax('GET', url + '?' + params, req,
        // Successful callback
        function(res) {
          var items = JSON.parse(res);
          if (!items || items.length === 0) {
            showWarningMsg("No favorite item.");
          } else {
          itemList(items);
          }
        }, 
        // Failed callback
        function() {
          showErrorMsg("Cannot load favorite items.");
        }
      );
    }
  }

  /**
   * API #3
   * Load recommended items
   * API endpoint: [GET] /recomendation?user_id=1111
   */
  function laodRecommendedItems() {
    activateBtn('recommend-btn');

    // Request parameters
    var url = './recommendation';
    var params = 'user_id' + user_id;
    var req = JSON.stringify({});

    // Display loading message
    showLoadingMsg("Loading favorite items...");

    // Make AJAX call
    ajax('GET', url + '?' + params, req, 
      // Successful callback
      function(res) {
        var items = JSON.parse(res)
        if (!items || items.length === 0) {
          showWarningMsg("No recommended item. Favorite some items to get recommendations!");
        } else {
          itemList(items);
        }
      }, 
      // Failed callback
      function() {
        showErrorMsg("Cannot load favorite items.");
      }
    );
  }






})()