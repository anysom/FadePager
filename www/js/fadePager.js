;(function(root) {
  'use strict';

  /**
  * Markup:
  * <div class="fade-pager">
      <ul class="fade-pager__pages">
        <li class="fade-pager__page frontpage-presentation__page active">
          <img src="http://lorempixel.com/400/200/people/1" alt="alt text">
        </li>
        <li class="fade-pager__page frontpage-presentation__page">
          <img src="http://lorempixel.com/400/200/people/2" alt="alt text">
        </li>
      </ul>
      <ul class="fade-pager__indicators">
          <li class="fade-pager__indicator active"></li>
          <li class="fade-pager__indicator"></li>
      </ul>

      <button class="fade-pager__btn--prev">Prev</button>
      <button class="fade-pager__btn--next">next</button>
    </div>
  *******
  *
  * Options:
  *   -auto: (BOOLEAN) dictates wether the pages should change automatically. Defaults to false
  *   -startIndex: (INTEGER) the index of the first item to display. Defaults to 0.
  *   -interval: (INTEGER) the interval at which to change page if auto is set to true. Defaults to 5000.
  *
  */
  var FadePager = function (fadePagerElem, options) {
    //if no carousel exists on the page, return
    if (fadePagerElem.length === 0) {
      return;
    }

    //if options are not supplied, create empty options object
    options = options || {};

    var pageElems = fadePagerElem.querySelectorAll('.fade-pager__page');
    var prevBtn = fadePagerElem.querySelector('.fade-pager__btn--prev');
    var nextBtn = fadePagerElem.querySelector('.fade-pager__btn--next');
    var indicatorBtns = fadePagerElem.querySelectorAll('.fade-pager__indicator');
    var index = options.startIndex || 0;
    var periodTime = options.interval || 5000;
    var auto = options.auto ||false;
    var activeClass = 'active';
    var fadeOutClass = 'fade-out';
    var activeElem = null;
    var activeIndicator = null;


    //If there are any active classes on any item other than the one set as the start index, remove them.
    for (var i = 0; i < pageElems.length; i++) {
      if (i !== index) {
        pageElems[i].classList.remove(activeClass);
      }
    }


    if (auto) {
      //set first active element, and at a set interval show the next page.
      var interval = setInterval(function () {
        var oldIndex = index;
        incrementIndex();
        changePage(index, oldIndex);
      }, periodTime);
    }

    changePage(index);
    setTimeout(function() {
      fadePagerElem.classList.add('initialized');
    }, 1);



    //***** public functions *******************
    this.next = function () {
      var oldIndex = index;
      incrementIndex();
      manualPageChange(index, oldIndex);
    };

    this.prev = function () {
      var oldIndex = index;
      decrementIndex();
      manualPageChange(index, oldIndex);
    };

    this.gotoIndex = function (_index) {
      var oldIndex = index;
      index = _index;
      manualPageChange(index, oldIndex);
    };

    this.getActivePage = function () {
      return pageElems[index];
    };
    //***** public functions end ***************


    //set click handlers
    nextBtn.addEventListener('click', this.next);
    prevBtn.addEventListener('click', this.prev);

    //Add event listener for page change on all indicators
    for (var i = 0; i < indicatorBtns.length; i++) {
      indicatorBtns[i].addEventListener('click', function (e) {
        var oldIndex = index;
        index = getIndex(this);
        manualPageChange(index, oldIndex);
      });
    }

    //gets the index of an li
    function getIndex(node) {
      var children = node.parentNode.querySelectorAll('.fade-pager__indicator');
      for (var i = 0; i < children.length; i++) {
        if (node === children[i]) break;
      }
      return i;
    }

    function manualPageChange(_index, oldIndex) {
      changePage(_index, oldIndex);

      if (auto) {
        clearInterval(interval);
        interval = setInterval(function () {
          var oldIndex = index;
          incrementIndex();
          changePage(index, oldIndex);
        }, periodTime);
      }
    }

    //increments the index. And if the index would then go out of bounds, reset it to 0.
    function incrementIndex() {
      index++;

      if (index === pageElems.length) {
        index = 0;
      }
    }
    function decrementIndex() {
      index--;

      if (index < 0) {
        index = pageElems.length - 1;
      }
    }

    function changePage(index, oldIndex) {
      if (options.onChange) {
        options.onChange(pageElems[index], pageElems[oldIndex]);
      }

      //if another slide was previously active, append 'fade-out' class to it, to fade it out.
      //when the fade animation is done, remove the active and fade out classes.
      var prevActiveElem = activeElem;

      if (activeIndicator) {
        activeIndicator.classList.remove(activeClass);
      }

      if (prevActiveElem) {
        prevActiveElem.classList.add(fadeOutClass);
        prevActiveElem.classList.remove(activeClass);

        setTimeout(function () {
          prevActiveElem.classList.remove(fadeOutClass);
        }, 400);
      }

      //toggle next active element
      activeElem = pageElems[index];
      activeElem.classList.add(activeClass);
      activeIndicator = indicatorBtns[index];
      if (activeIndicator) {
        activeIndicator.classList.add(activeClass);
      }
    }
  };

  root.FadePager = FadePager;
})(this);
