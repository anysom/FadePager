;(function(root, $) {
  'use strict';

  var FadePager = function ($fadePagerElem, options) {
    //if no carousel exists on the page, return
    if ($fadePagerElem.length === 0) {
      return;
    }

    var $pageElems = $fadePagerElem.find('.fade-pager__page');
    var $prevBtn = $fadePagerElem.find('.fade-pager__btn--prev');
    var $nextBtn = $fadePagerElem.find('.fade-pager__btn--next');
    var $indicatorBtns = $fadePagerElem.find('.fade-pager__indicator');
    var index = options.startIndex || 0;
    var periodTime = 4000;
    var activeClass = 'active';
    var fadeOutClass = 'fade-out';
    var $activeElem = null;
    var $activeIndicator = null;

    if (options.auto) {
        //set first active element, and at a set interval show the next page.
        var interval = setInterval(function () {
          var oldIndex = index;
          incrementIndex();
          changePage(index, oldIndex);
        }, periodTime);
      }

      changePage(index);
      setTimeout(function() {
        $fadePagerElem.addClass('initialized');
      }, 1);

    //***** public functions *******************
    this.next = function () {
      var oldIndex = index;
      incrementIndex();
      manualPageChange(index, oldIndex);
    }

    this.prev = function () {
      var oldIndex = index;
      decrementIndex();
      manualPageChange(index, oldIndex);
    }

    this.gotoIndex = function (_index) {
      var oldIndex = index;
      index = _index;
      manualPageChange(index, oldIndex);
    }

    this.getActivePage = function () {
      return $($pageElems[index]);
    };
    //***** public functions end ***************


    //set click handlers
    $nextBtn.click(this.next);
    $prevBtn.click(this.prev);
    $indicatorBtns.click(function () {
      var oldIndex = index;
      index = $(this).index();
      manualPageChange(index, oldIndex);
    });


    function manualPageChange(_index, oldIndex) {
      changePage(_index, oldIndex);

      if (options.auto) {
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

      if (index === $pageElems.length) {
        index = 0;
      }
    }
    function decrementIndex() {
      index--;

      if (index < 0) {
        index = $pageElems.length - 1;
      }
    }

    function changePage(index, oldIndex) {
      if (options.onChange) {
        options.onChange($($pageElems[index]), $($pageElems[oldIndex]));
      }

      //if another slide was previously active, append 'fade-out' class to it, to fade it out.
      //when the fade animation is done, remove the active and fade out classes.
      var $prevActiveElem = $activeElem;

      if ($activeIndicator) {
        $activeIndicator.removeClass(activeClass);
      }

      if ($prevActiveElem) {
        $prevActiveElem.addClass(fadeOutClass);
        $prevActiveElem.removeClass(activeClass);

        setTimeout(function () {
          $prevActiveElem.removeClass(fadeOutClass);
        }, 400);
      }

      //toggle next active element
      $activeElem = $($pageElems[index]).addClass(activeClass);
      $activeIndicator = $($indicatorBtns[index]).addClass(activeClass);
    }

    root.FadePager = FadePager;
  };)(this, $);
