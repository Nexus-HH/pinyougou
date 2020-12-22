$(function() {
    var flag = true;//节流阀，互斥锁
    // 1.显示隐藏电梯导航
    var toolTop = $(".recommend").offset().top;
    toggleTool();

    function toggleTool() {
        if ($(document).scrollTop() >= toolTop) {
            $(".fixedtool").fadeIn();
        } else {
            $(".fixedtool").fadeOut();
        };
    }

    $(window).scroll(function() {
        toggleTool();
        // 3. 页面滚动到某个内容区域，左侧电梯导航小li相应添加和删除current类名
        if(flag){
            $(".floor .w").each(function(i, ele) {
                if ($(document).scrollTop() >= $(ele).offset().top) {
                    // console.log(i);
                    $(".fixedtool li").eq(i).addClass("current").siblings().removeClass();
                }
            })
        }
    });
    // 2. 点击电梯导航页面可以滚动到相应内容区域
    //点击之后页面滚动，同时触发window.scroll所以我们希望不触发，就要加一个判断条件。利用flag
    $(".fixedtool li").click(function() {
        flag = false;
        // console.log($(this).index());
        // 当我们每次点击小li 就需要计算出页面要去往的位置 
        // 选出对应索引号的内容区的盒子 计算它的.offset().top
        var current = $(".floor .w").eq($(this).index()).offset().top;
        // 页面动画滚动效果
        $("body, html").stop().animate({
            scrollTop: current
        },function(){
            flag=true;
        });//回调函数，点击跳转完成后执行，让flag为true
        // 点击之后，让当前的小li 添加current 类名 ，姐妹移除current类名
        $(this).addClass("current").siblings().removeClass();
    })

    // 轮播图
    // 1 鼠标经过轮播图模块按钮显示，离开按钮隐藏
    var focus = document.querySelector(".focus");
    var focusWidth = focus.offsetWidth;
    var al = focus.querySelector(".arrow-l");
    var ar = focus.querySelector(".arrow-r");
    focus.addEventListener("mouseenter",function(){
        al.style.display = "block";
        ar.style.display = "block";
        // 停止定时器
        clearInterval(timer);
        timer = null;
    });
    focus.addEventListener("mouseleave",function(){
        al.style.display = "none";
        ar.style.display = "none";
        // 开启定时器
        timer = setInterval(function(){
            ar.click();
        }, 2000);
    });
    // 2 有多少张轮播图就有多少个小圆圈，第一个小圆圈加current类
    var ul = focus.querySelector("ul");
    var ol = focus.querySelector('ol');
    for (let i = 0; i< ul.children.length; i++) {
        var li = document.createElement("li");
        li.setAttribute("index",i);            //加个自定义属性，作为索引号
        ol.appendChild(li);
            //3 点击当前小圆圈就给当前添加current类，其他排除
        li.addEventListener("click",function(){
            for (let j = 0; j < ol.children.length; j++) {
                ol.children[j].className = "";
            }
            this.className = "current";
            //4 点击小圆圈就可以切换图片，注意是ul动而不是li动，ul移动小圆圈的索引号*ul宽度 负值
            var index = this.getAttribute("index");
            //当我们点击了小圆圈，num必须改变为当前小圆圈的index，否则会有bug
            //不改的话，例如我点右侧按钮到了第三张图片，点小圆圈到了第二张图，这时候num为2，再点按钮num加1为3就到了第四张图片，而不是第三张图
            num = index;
            //num=index后，当我们点击了小圆圈，circle必须改变为当前小圆圈的index，否则会有bug
            //不改的话，例如我点小圆圈到了第三张图片此时circle为0，点右侧按钮到了第四张图，这时候circle为1，而不是3
            circle = index;
            animate(ul,-index * focusWidth);
        });
    };
    ol.children[0].className = "current";
    //5 点击右侧按钮，图片切换一张，设置一个变量点了几次右侧就加
    // 为了防止连续快速点击按钮导致图片过快显示，我们可以设置节流阀，利用回调函数来锁住和解锁
    var flag1 = true;
    var num = 0;
    //克隆第一张图片
    var first = ul.children[0].cloneNode(true);
    ul.appendChild(first);
    // 控制小圆圈的移动
    var circle = 0;
    ar.addEventListener("click",function(){
        if(flag1){
            flag1 = false;
            //无缝滚动 在最后一张图片后面放第一张图片 点击后不做动画的立即换成第一张
            if(num == ul.children.length-1){
                ul.style.left = 0;
                num = 0;
            }
            num++;
            animate(ul,-num*focusWidth,function(){
                flag1 = true; 
            });
            //点击右侧按钮，小圆圈也要动
            circle++;
            circle = circle == ol.children.length ? 0 : circle;
            circleChange();
        }
    });
    //左侧按钮
    al.addEventListener("click",function(){
        if(flag1){
            flag1 = false;
            if(num == 0){
                ul.style.left = - focusWidth*(ul.children.length-1) + "px";
                num = ul.children.length-1;
            }
            num--;
            animate(ul,-num*focusWidth,function(){
                flag1 = true;
            });
            //点击右侧按钮，小圆圈也要动
            circle--;
            circle = circle < 0 ? ol.children.length-1 : circle;
            circleChange();
        }
    });
    function circleChange(){
        for (let index = 0; index < ol.children.length; index++) {
            ol.children[index].className = "";
        }
        ol.children[circle].className = "current";
    }
    //自动播放图片
    var timer = setInterval(function(){
        ar.click();
    }, 2000);
})