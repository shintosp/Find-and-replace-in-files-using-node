var ChatClient,Identity,IPM_Channel,Transferred,SessionId=$.cookie("_sa"),BaseUrl="https://comms-api.scorpion.co",today=(new Date).getDay();IPM_QueueMessages=[],rrequire(["jquery","static","uri","cookie","m/date","https://media.twiliocdn.com/sdk/js/client/v1.5/twilio.min.js","https://media.twiliocdn.com/sdk/js/chat/v3.2/twilio-chat.min.js"],function(t,e){var a,n,s,i,o,c,r,l,d=null,h=null,m=null,p=null,g=e.CMS||{},u=g.Chat||{},C={Domain:document.URL,"Chat URL":null,Referrer:document.referrer,"Email Address":null,SPPC:null,"IP Address":null,"User Agent":{Browser:null,Version:null}};if(async function(){const t=await fetch("https://api.ipify.org/?format=json"),e=await t.json();C["IP Address"]=e.ip}(),o=navigator.userAgent,c=navigator.appName,r=""+parseFloat(navigator.appVersion),l=parseInt(navigator.appVersion,10),-1!=(s=o.indexOf("Opera"))?(c="Opera",r=o.substring(s+6),-1!=(s=o.indexOf("Version"))&&(r=o.substring(s+8))):-1!=(s=o.indexOf("MSIE"))?(c="Microsoft Internet Explorer",r=o.substring(s+5)):-1!=(s=o.indexOf("Chrome"))?(c="Chrome",r=o.substring(s+7)):-1!=(s=o.indexOf("Safari"))?(c="Safari",r=o.substring(s+7),-1!=(s=o.indexOf("Version"))&&(r=o.substring(s+8))):-1!=(s=o.indexOf("Firefox"))?(c="Firefox",r=o.substring(s+8)):(n=o.lastIndexOf(" ")+1)<(s=o.lastIndexOf("/"))&&(c=o.substring(n,s),r=o.substring(s+1),c.toLowerCase()==c.toUpperCase()&&(c=navigator.appName)),-1!=(i=r.indexOf(";"))&&(r=r.substring(0,i)),-1!=(i=r.indexOf(" "))&&(r=r.substring(0,i)),l=parseInt(""+r,10),isNaN(l)&&(r=""+parseFloat(navigator.appVersion),l=parseInt(navigator.appVersion,10)),C["User Agent"].Browser=c,C["User Agent"].Version=r,Modernizr.websockets){e.CMS||(e.CMS=g),g.Chat||(g.Chat=u),g.Chat.checkPageType=function(){var t;t=navigator.userAgent||navigator.vendor||window.opera,/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(t)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0,4))?g.Chat.setState("pageType","Mobile"):g.Chat.setState("pageType","Desktop")},u.init=function(){g.Chat.checkPageType(),t("head").append('<link rel="stylesheet" type="text/css" href="https://cdn.cxc.scorpion.direct/chat-v3.css">'),d=t(a),h=d.find("textarea"),m=d.find("ul"),t("body").find("#ScorpionConnect")&&t("body").append(d);var e=g.Chat.getState().businessName;e.substring(0,30)!==e?t(d).find(".businessName").html(e.substring(0,28)+"..."):t(d).find(".businessName").html(e),t("#ScorpionConnect").hide(),d.addClass("cms-connect"),d.find(".agent-image").css("background-image","url("+g.Chat.getState().agentImage+")");var n=g.Chat.getState().customLogoPath;switch(n>""&&(d.addClass("cms-busi-logo"),t(".cms-connect-header").find(".logo").css("background-image","url("+n+")")),"True"==g.Chat.getState().noStaffImage&&d.addClass("no-staff-image"),g.Chat.getState().placementTypeID){case 1:d.addClass("cms-layout-br");break;case 2:d.addClass("cms-layout-bl");break;case 3:d.addClass("cms-layout-cr");break;default:d.addClass("cms-layout-br")}var s=null==g.Chat.getState().p_color?"light":g.Chat.getState().p_color,i=!1;switch(s.substring(0,1)){case"l":d.addClass("cms-theme-light");break;case"d":d.addClass("cms-theme-dark");break;case"#":d.addClass("cms-theme-inherit"),i=!0;break;default:d.addClass("cms-theme-light")}if(1==i){var o=".cms-connect.cms-theme-inherit .cms-agent > .cms-profile {\t\t\t\t\t\tbackground-color: {replace};\t\t\t\t\t}\t\t\t\t\t.cms-connect.cms-theme-inherit .cms-agent:before {\t\t\t\t\t\tborder-color: {replace};\t\t\t\t\t}\t\t\t\t\t.cms-connect.cms-theme-inherit .cms-agent .cms-message-toast {\t\t\t\t\t\tbackground-color: {replace};\t\t\t\t\t}\t\t\t\t\t.cms-connect.cms-theme-inherit .cms-connect-header {\t\t\t\t\t\tbackground-color: {replace};\t\t\t\t\t}\t\t\t\t\t.cms-connect.cms-theme-inherit .cms-connect-scroll li.user {\t\t\t\t\t\tbackground-color: {replace};\t\t\t\t\t}\t\t\t\t\t.cms-connect.cms-theme-inherit .cms-connect-scroll li.user:before {\t\t\t\t\t\tbackground-color: {replace};\t\t\t\t\t}\t\t\t\t\t.cms-connect.cms-theme-inherit .cms-connect-chat textarea:focus {\t\t\t\t\t\tborder-color: {replace};\t\t\t\t\t}\t\t\t\t\t.cms-connect.cms-theme-inherit .cms-connect-chat a {\t\t\t\t\t\tbackground-color: {replace};\t\t\t\t\t}\t\t\t\t\t.cms-connect .chat-history li .type-load span:before {\t\t\t\t\t\tbackground-color: {replace} !important\t\t\t\t\t}";o=o.replace(new RegExp("{replace}","g"),s),t("<style type='text/css'>"+o+"</style>").appendTo("head")}var c=g.Chat.getState().bump,r=g.Chat.getState().bumpMessage;"True"==c&&r>""&&(d.find(".cms-message-toast").attr("data-message",r),"Mobile"==g.Chat.getState().pageType&&d.find(".cms-message-toast").attr("data-message","Text Us Now"),setTimeout(function(){d.addClass("cms-bump")},5e3)),g.Chat.getPhoneFromCookie=function(){var t=document.cookie.split("; "),e=[],a=[];for(n=0;n<t.length;n++)e.push(t[n].split("="));for(var n in e)a[e[n][0]]=e[n][1];return a.PPCP1?phone=a.PPCP1:a.PPCP2?phone=a.PPCP2:a.SubPhone?phone=a.SubPhone:phone=g.Chat.getState().cidnum,phone},t(".cms-connect").on("click",function(e){var a=Get.LinkData(e);switch(a.action){case"Minimize":d.removeClass("expand"),d.removeClass("cms-bump"),u.minimize();break;case"Maximize":"Desktop"==g.Chat.getState().pageType&&(d.addClass("expand"),void 0===d.find(".system-notification").html()&&g.Chat.printMessage(g.Chat.getState().introMessage,"System"));break;case"Close":return void u.minimize();case"Destroy":return void(1==confirm("Are you sure you want to end your chat session?")&&(g.Chat.setState("minimize",!0),d.removeClass("expand"),u.destroy(!1)));case"XOut":return void u.destroy(!1);default:return"Desktop"==g.Chat.getState().pageType&&(0===m[0].children.length&&g.Chat.printMessage(g.Chat.getState().introMessage,"System"),d.hasClass("expand")||(d.addClass("expand"),g.Chat.setState("minimize",!1))),void("Mobile"==g.Chat.getState().pageType&&(t(".cms-connect-sms-click-text")[0].click(),d.hide()))}}).find("a").on("dragstart",function(t){return!1}),p=d.find("a.chat-start"),d.on("click",function(t){switch(Get.LinkData(t.originalEvent).action){case"Close":_active=!1,d.remove();break;case"Send":h.val()>""&&u.send(null)}}),h.on("keydown",function(t){if(13==t.which&&!t.shiftKey)return h.val()>""&&u.send(null),StopAll(t);void 0!==IPM_Channel&&IPM_Channel.typing()}),setTimeout(function(){t("#ScorpionConnect").show()},1e3)},u.loadingBubbles=function(e){e?t('<div class="loader"><div></div><div></div><div></div><div></div></div>').appendTo(m).scrollIntoView(100,8):m.find(".loader").remove()},u.start=function(){u.loadingBubbles(!0);var e="rodfarva.scorpionlocal.com"==document.location.host;t.ajax({method:"POST",url:BaseUrl+"/CX/Chat/Init",data:{SessionID:SessionId,ClientID:g.Chat.getState().clientID,ProjectID:g.Chat.getState().projectID,Name:"Anonymous User",Email:"n/a",AgentName:g.Chat.getState().agentName,AgentImage:g.Chat.getState().agentImage,BusinessName:g.Chat.getState().businessName,ScorpionInternal:e}}).done(function(t){t.ChatToken?(g.Chat.setState("ChatToken",t.ChatToken),g.Chat.setState("ChannelSid",t.ChannelSid),g.Chat.setState("Identity",t.GuestIdentity),Twilio.Chat.Client.create(t.ChatToken).then(function(e){ChatClient=e,ChatClient=e.getSubscribedChannels().then(k(e,t.ChannelSid))})):(g.Chat.setState("ChannelSid",t.ChannelSid),g.Chat.setState("Identity",t.GuestIdentity),u.getToken(t.GuestIdentity,t.ChannelSid))})},u.getToken=function(e,a){t.ajax({method:"POST",url:BaseUrl+"/CX/Chat/Token",data:{Identity:e}}).done(function(t){g.Chat.setState("ChatToken",t.ChatToken),Twilio.Chat.Client.create(t.ChatToken).then(function(t){ChatClient=t,ChatClient=t.getSubscribedChannels().then(k(t,a))})})},u.recover=function(){var e=t.cookie("SEOV"),a=t.cookie("SEOT"),n=g.Chat.getState().pt,s=g.Chat.getState().pv;1==g.Chat.getState().started||1==function(t,e,a,n){if(!0!==g.Chat.getState().minimize){var s=t?parseInt(t):0,i=e?parseInt(e):0;return a>0&&n>0&&(a<=s||n<=i)}return!1}(a,e,n,s)?(d.addClass("expand"),u.printMessage(g.Chat.getState().proactiveMessage,"System")):1==g.Chat.getState().minimize&&d.removeClass("expand"),!ChatClient&&g.Chat.getState().ChatToken&&(ChatClient=Twilio.Chat.Client.create(g.Chat.getState().ChatToken).then(function(t){return ChatClient=t,ChatClient=t.getSubscribedChannels().then(k(t,g.Chat.getState().ChannelSid)),t}))},u.destroy=function(t){t||(m.empty(),d.hide(),2===IPM_Channel.members.size&&IPM_Channel.sendMessage("clientmetadata:close-task")),Transferred=!0,g.Chat.setState("started",!1),g.Chat.setState("ChannelSid",""),g.Chat.setState("ChatToken",void 0),IPM_Channel=void 0},u.updateTypingIndicator=function(e){if(e){var a=t(_htmlTyping);a.find("p"),a.appendTo(m).scrollIntoView(100,8)}else m.find(".is-typing").remove()},u.minimize=function(){d.removeClass("expand"),g.Chat.setState("minimize",!0)},u.send=function(t){var e=t>""?t:h.val();void 0!==IPM_Channel?IPM_Channel.sendMessage(e.trim()):null==IPM_Channel&&(g.Chat.start(),IPM_QueueMessages.push(e)),t||h.val("").trigger("input")},u.printMessage=function(e,a){if(!e)return null;if("Guest"==a)template=_htmlMe;else if("System"==a)template=_htmlSystem;else{new Audio("https://cdn.cxc.scorpion.direct/ChatNotificationAudio.wav").play(),template=_htmlThem,d.hasClass("expand")||(d.find(".cms-message-toast").attr("data-message",e),d.addClass("cms-bump"))}var n=t(template);a&&(p.addClass("chatting"),p[0].childNodes[0].style.backgroundImage="url('"+function(t){return"System"!==t||"Guest"!==t?g.Chat.getState().agentImage:""}(a)+"')"),e=e.replace(/_/g,"&lowbar;").replace(/<[^>]+>/g," ").replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n/g,"<br>").replace(/(\*{1,3}|~|_)([^\*]+)\1/g,function(t,e,a){switch(e){case"*":return"<em>"+a+"</em>";case"**":return"<strong>"+a+"</strong>";case"***":return"<strong><em>"+a+"</em></strong>";case"~":return"<strike>"+a+"</strike>"}}).replace(/\bhttps?:\/\/\S+/g,function(t){return'<a href="'+t+'" target="_blank">'+t+"</a>"}),n.find("p").attr("data-timestamp",(new Date).formatted("h:mmtt").toLowerCase()).html(e),n.appendTo(m).scrollIntoView(100,8),u.updateTypingIndicator(!1)},t(document).on("focus",".cms-connect-chat",function(){t("#ScorpionConnect").addClass("cms-chatting"),t("#ScorpionConnect").addClass("cms-conversion")}),t(document).on("blur",".cms-connect-chat",function(){t("#ScorpionConnect").removeClass("cms-chatting"),t("#ScorpionConnect").removeClass("cms-conversion")}),a='\t\t\t<div icobalt="" id="ScorpionConnect" class="">\t\t\t\t<div class="cms-connect-portal">\t\t\t\t\t<header class="cms-connect-header">\t\t\t\t\t\t<a href="javascript:void(\'Minimize\')" class="minimize"><img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" width="0" height="0" alt="Minimize Chat"/></a>\t\t\t\t\t\t<a href="javascript:void(\'Destroy\')" class="end"><img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" width="0" height="0" alt="Close Chat"/></a>\t\t\t\t\t\t<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" class="logo" alt="Business Logo" >\t\t\t\t\t</header>\t\t\t\t\t<div class="cms-connect-scroll chat-history">\t\t\t\t\t\t<ul></ul>\t\t\t\t\t</div>\t\t\t\t\t<div class="cms-connect-chat">\t\t\t\t\t\t<label />\t\t\t\t\t\t<textarea id="cms-connect-chat-input" placeholder="Type your response here"></textarea>\t\t\t\t\t\t<a href="javascript:void(\'Send\')"><img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" width="0" height="0" alt="Send Message"/>Send Message</a>\t\t\t\t\t</div>\t\t\t\t</div>\t\t\t\t<div class="cms-agent" data-notification="1">\t\t\t\t\t<div class="cms-message-toast" data-message="Hi, how can I help you?" data-agent="">\t\t\t\t\t\t<a href="javascript:void(\'XOut\')" class="close"><img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" width="0" height="0" alt="Close Chat"/></a>\t\t\t\t\t</div>\t\t\t\t\t<div class="cms-profile">\t\t\t\t\t\t<a href="javascript:void(\'Start\');" class="chat-start" role="button"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" class="agent-image" alt="Open Chat"/></a>\t\t\t\t\t</div>\t\t\t\t\t<span class="businessName"></span>\t\t\t\t</div>\t\t\t</div>',_htmlMe='\t\t\t<li class="user"><p></p></li>',_htmlThem='\t\t\t<li class="agent"><p></p></li>',_htmlSystem='\t\t\t<li class="system-notification"><p></p></li>',_htmlTyping='\t\t\t<li class="agent is-typing">\t\t\t\t<p>\t\t\t\t\t<span class="type-load"><span></span><span></span><span></span></span>\t\t\t\t</p>\t\t\t</li>';var f=null;if(g.Chat.getState=function(){var t;if(!f)if(t=localStorage.chatData)try{f=JSON.parse(t)||{}}catch(t){f={}}else f={};return f},g.Chat.setState=function(t,e){var a=g.Chat.getState();a[t]=e,localStorage.chatData=JSON.stringify(a)},!0===g.Chat.getState().started)"Desktop"==g.Chat.getState().pageType&&(g.Chat.init(),g.Chat.recover());else{var A,v=t("html").data("sa"),S=t("body").data("location"),b=t.cookie("L");function y(e){g.Chat.setState("data",e),g.Chat.setState("sta",e.s),g.Chat.setState("end",e.e),g.Chat.setState("scorpionInternal",e.i),g.Chat.setState("clientID",e.c),g.Chat.setState("projectID",e.p),g.Chat.setState("introMessage",e.im),g.Chat.setState("proactiveMessage",e.pm),g.Chat.setState("pt",e.pt),g.Chat.setState("pv",e.pv),g.Chat.setState("ps",e.pv),g.Chat.setState("cidnum",e.cidnum),g.Chat.setState("agentName",e.an),g.Chat.setState("agentImage",e.ai),g.Chat.setState("noStaffImage",e.nsi),g.Chat.setState("bump",e.bu),g.Chat.setState("bumpMessage",e.bm),g.Chat.setState("placementTypeID",e.ptid),g.Chat.setState("p_color",e.p_color),g.Chat.setState("f_color",e.f_color),g.Chat.setState("customLogoPath",e.clp),g.Chat.setState("businessName",e.bn),g.Chat.setState("started",!1),g.Chat.init(),"Desktop"==g.Chat.getState().pageType?g.Chat.recover():t(".cms-connect").append('<a href="sms:'+g.Chat.getPhoneFromCookie()+'" style="display:none" class="cms-connect-sms-click-text">clickToText</a>')}S>0&&(b=S),SessionId=t.cookie("_sa"),A=b>""?"https://sdrest.scorpiondesign.com/API/CX/v3/ChatPre?SAData="+v+"&dataLocation="+b:"https://sdrest.scorpiondesign.com/API/CX/v3/ChatPre?SAData="+v,t.ajax({url:A,dataType:"json",success:function(e){t.ajax({url:BaseUrl+"/CX/Chat/Pre?sdProjectId="+e.p,success:function(t){!function(t){for(var e=0;e<t.length;e++){var a=t[e];a.s&&a.e?(n=a.s,s=a.e,i=void 0,o=void 0,i=T(n),o=T(s),utcNow=T(new Date),utcNow>i&&utcNow<o&&y(a)):y(a)}var n,s,i,o}(t)}})}})}window.register&&window.register("cms/chat")}function k(t,e){t.getChannelByUniqueName(e).then(function(t){IPM_Channel=t,I(t,Transferred||null),g.Chat.setState("started",!0)}).then(function(){Transferred=void 0})}function w(t){return t==g.Chat.getState().Identity?"Guest":"Agent"}function I(t,e){e||(t.on("messageAdded",function(t){u.printMessage(t.body,w(t.author))}),t.on("typingStarted",function(){u.updateTypingIndicator(!0)}),t.on("typingEnded",function(){u.updateTypingIndicator(!1)})),t.on("memberLeft",function(){u.destroy(!0)}),t.getMessages(50).then(function(t){for(var e=0;e<t.items.length;e++){var a=t.items[e];void 0!==a.author&&u.printMessage(a.body,w(a.author))}}).then(function(){if(IPM_QueueMessages.length>0){for(var t=0;t<IPM_QueueMessages.length;t++)u.send(IPM_QueueMessages[t]);IPM_QueueMessages=[]}}).then(function(){u.loadingBubbles(!1)}).catch(function(t){console.log("An error while getting the message history",t)})}function T(t){var e;return e=t.getTime()+6e4*t.getTimezoneOffset(),e-=18e6}});