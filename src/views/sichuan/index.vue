<template>
    <div class="chat_content_box">
        <div class="maskModal">
           <div class="left_info_box">
              <div class="otherInfo_box">
                <div class="avatar">
                   <img src="./images/customerService.png" alt="">
                    <Tooltip :content="getStatusText">
                         <div class="circle_status" :style="{backgroundColor:getStatusColor}"></div>
                    </Tooltip><br><br>
                </div>
                 <span style="font-weight: 700;font-size:16px;margin-top: 10px;">{{chatPerson}}为你服务</span>
                 <span class="timeRange" style="margin-top: 10px;">在线客服时间：</span>
                 <span class="timeRange">周一至周五：09:00 - 18:00</span>
              </div>
              <div class="chat_records">
                 <Input suffix="ios-search" placeholder="历史会话记录" style="width: auto;margin-top: 10px;" />
                 <div class="records_carousel">
                   <!-- 原会话记录分页代码 -->
                   <!-- <Carousel
                    v-model="currentIndex"
                    dots="none"
                    :radius-dot="false"
                    trigger="click"
                    arrow="never">
                    <CarouselItem v-for="(item, ind) in newRecord" :key="ind">
                        <ul class="demo-carousel">
                           <li v-for="(value,index) in item.records" :key="index">
                                <span>{{index+1+(ind*5) }}、{{ value.startTime }}</span>
                                <span class="record">{{ value.content }}</span>
                            </li>
                        </ul>
                    </CarouselItem>
                   </Carousel> -->
                    <ul class="records_ul">
                        <li :class="{active_li:activeIndex == index,firstActive:index == 0}" v-for="(item,index) in chatRecords" :key="index" @click="clickRecord(item,index)">
                            <div class="time_img">
                               <span>{{index+1}}、{{ item.startTime }}</span>
                               <img v-if="index == 0 && !isEvaluationEnd" src="./images/chatting.png" alt="">
                            </div>
                            <span class="record">{{ item.title }}</span>
                        </li>
                    </ul>
                 </div>
                 <!-- 原会话记录分页按键 -->
                 <!-- <div>
                    <Icon type="md-arrow-dropleft" :size="30"  
                    :color="btnStatus=='left' || btnStatus=='both' ? '#2db7f5' : '#cccccc'"  style="cursor: pointer;" @click="changeIndex(-1)"/>
                    <Icon type="md-arrow-dropright" :size="30" 
                    :color="btnStatus=='right' || btnStatus=='both' ? '#2db7f5' : '#cccccc'" style="cursor: pointer;"  @click="changeIndex(1)"/>
                 </div> -->
              </div>
           </div>
           <div class="right_chat_box">
              <div class="chat_header_box">
                <ul  class="header_btns_box">
                   <li>
                      <Icon type="ios-remove" size="28" color="#2db7f5"/>
                   </li>
                   <li>
                      <Icon type="ios-expand" size="16" color="#2db7f5" style="font-weight: 700;"/>
                   </li>
                   <li>
                      <Icon type="ios-close" size="30" color="#2db7f5"/>
                   </li>
                </ul>
                <div class="system_type">
                    当前咨询系统：<span class="system_name">集中化PMS</span>
                </div>
              </div>
              <div class="chating_box">
                 <div ref="session_box" class="session_box">
                    <ul  class="session_chat_ul">
                        <li v-if="isInline == 'Busy' || isInline == 'no-inline'" class="systemWarning">
                            <span>{{ warningMessage }}</span>
                        </li>
                        <li v-for="(item,index) in chatContent" :key="index">
                           <div v-if="item.Identity == 'other'" class="other_content_box">
                             <div class="other_info_box">
                                <div class="otherImg">
                                   <img :src="IdentityMark == 'CS' ? usImg : csImg" alt="">
                                </div>
                                <span style="padding:0 10px;">{{ chatPerson }}</span>
                                <span>{{ item.dateTime }}</span>
                             </div>
                             <div class="other_chat_content">
                                <div v-if="item.type=='text'" class="content other_word_content"  v-html="item.content" @contextmenu.prevent="onRightClick"></div>
                                <div v-else class="content other_word_content">
                                    <img src="./images/11.jpg" alt="">
                                </div>
                             </div>
                             <div class="other_chat_content " v-if="item.quoteContent">
                                 <div class="content quote_chat_content"  v-html="item.quoteContent"></div>
                             </div>
                           </div>
                           <div v-else class="self_content_box">
                                <div class="self_info_box">
                                    <span style="padding: 0 10px;">{{ item.dateTime }}</span>
                                    <div class="selfImg">
                                       <img :src="IdentityMark !== 'CS' ? usImg : csImg" alt="">
                                    </div>
                                </div>
                                <div class="self_chat_content">
                                    <div v-if="item.type=='text'" class="content sef_word_content"  v-html="item.content" @contextmenu.prevent="onRightClick"></div>
                                    <div v-else class="content other_word_content">
                                        <div :class="item.direction == 'horizontal' ? 'horizontal_div' : 'vertical_div'">
                                            <img  :src="item.imageUrl" alt="">
                                        </div>
                                    </div>
                                </div>
                                <div class="self_chat_content" v-if="item.quoteContent">
                                    <div class="content quote_chat_content"  v-html="item.quoteContent"></div>
                                </div>
                           </div>
                        </li>
                        <li v-if="!isCureentEndSeesion || activeIndex !== 0" class="systemWarning">
                            <span>（会话已结束）</span>
                        </li>
                    </ul>
                 </div>
                 <div v-if="activeIndex == 0 && isCureentEndSeesion" class="input_box" >
                    <!-- 输入框 -->
                    <div class="input_content" id="selfInput" ref="self_input_content" contenteditable="true" @keydown="handlekeydown" @paste="handlePaste">
                    </div>
                    <ul class="btns_ul">
                         <!-- <li>服务评价</li> -->
                         <li @click="clickEndSesseion">结束会话</li>
                    </ul>
                    <ul class="action_btns">
                         <li @click="sendContent"><Icon type="md-paper-plane" size="20" color="#fff"/></li>
                         <li @click="triggerFileInput"><Icon type="ios-image-outline" size="20" color="#fff"/></li>
                    </ul>
                 </div>
                 <div v-if="!isCureentEndSeesion && activeIndex == 0 && !isEvaluationEnd" class="service_evaluation_box" >
                      <span class="evaluation_title">要结束本次会话吗？</span>
                      <ul class="evaluation_ul">
                        <li>
                            <img :src="evaluateImg.isEvaluate ? evaluateImg.Notsatisfied_active : evaluateImg.Notsatisfied" alt="" @click="clickEvaluate(0)">
                            <span :style="{color: evaluateImg.isEvaluate ? '#000' : '#adadad'}">不满意</span>
                        </li>
                        <li>
                            <img :src="evaluateImg.isEvaluate1 ? evaluateImg.General_active : evaluateImg.General" alt="" @click="clickEvaluate(1)">
                            <span :style="{color: evaluateImg.isEvaluate1 ? '#000' : '#adadad'}">一般</span>
                        </li>
                        <li>
                            <img :src="evaluateImg.isEvaluate2 ?  evaluateImg.Satisfied_active : evaluateImg.Satisfied" alt="" @click="clickEvaluate(2)">
                            <span :style="{color: evaluateImg.isEvaluate2 ? '#000' : '#adadad'}">满意</span>
                        </li>
                        <li>
                            <img :src="evaluateImg.isEvaluate3 ? evaluateImg.Verysatisfied_active : evaluateImg.Verysatisfied" alt="" @click="clickEvaluate(3)">
                            <span :style="{color: evaluateImg.isEvaluate3 ? '#000' : '#adadad'}">非常满意</span>
                        </li>
                      </ul>
                      <div class="btns" contenteditable="false">
                          <Button @click="cancelevaluate">取消</Button>
                          <Button type="primary" @click="defineEndConversation">确认</Button>
                      </div>
                 </div>
              </div>
           </div>
        </div>
       <Transition name="slide-down">
            <div v-clickOutside="clicktabModal" class="tabsModal" ref="modalRef" v-show="isShowModal" :style="{top:topWidth+'px',left:leftWidth +'px'}">
                <ul>
                  <li @click="doCopy"><Icon type="ios-copy-outline" size="16"/>复制</li>
                  <li @click="doQuote"><Icon type="ios-code" size="16"/>引用</li>
                </ul>
            </div>
        </Transition>

        <input type="file" ref="fileInput" id="fileInput" style="display: none" @change="handleFileChange">
        <Modal width="350px" v-model="fileModal" draggable sticky scrollable :mask="false" title="是否发送：">
            <ul class="files_ul">
                <li>
                   <div class="file_info">
                        <img :src="files.imageUrl" alt="">
                        <div class="file_name">
                            <div class="names">{{files.name}}</div>
                            <div>{{files.size}}</div>
                        </div>
                   </div>
                   <!-- <Icon class="deletebtn" type="ios-trash" size="20"/> -->
                </li>
            </ul>
            <template #footer>
                <div class="fileModal_btns">
                    <Button type="success" @click="sendImg">发送</Button>
                    <Button @click="cancelFileModal">取消</Button>
                </div>
            </template>
           
        </Modal>
    </div>
</template>

<script>
import CSimg from './images/userPicture.png'
import USimg from './images/customerService.png'
import Notsatisfied from './images/notsatisfied.png'
import Notsatisfied_active from './images/notsatisfied_active.png'
import General from './images/General.png'
import General_active from './images/General_active.png'
import Satisfied from './images/Satisfied.png'
import Satisfied_active from './images/Satisfied_active.png'
import Verysatisfied from './images/verysatisfied.png'
import Verysatisfied_active from './images/verysatisfied_active.png'
import {formatBytes} from './common'
export default {
    data(){
        return {
          fileModal:false,
          cursorPosition:0,
          activeIndex:0,
          contextContent:'',//右键点击的信息
          quoteMessage:'',//引用的内容
          copyMessage: '',//复制的内容
          isShowModal:false,
          topWidth:0,
          leftWidth:0,
          currentIndex: 0,
          chatPerson:'002客服',//聊天对象
          IdentityMark:'CS',//CS--客服，US--用户
          isInline:'inLine',//客服是否在线   inLine-在线，Busy-忙碌 no-inline 离线
          statusList:[{label:'在线',value:'inLine'},{label:'忙碌',value:'Busy'},{label:'离线',value:'no-inline'}],
          warningMessage:'',
          isCureentEndSeesion:true,
          isEvaluationEnd:false,
          evaluateImg:{
            isEvaluate:false,
            Notsatisfied,
            Notsatisfied_active,
            isEvaluate1:false,
            General,
            General_active,
            isEvaluate2:false,
            Satisfied,
            Satisfied_active,
            isEvaluate3:true,
            Verysatisfied,
            Verysatisfied_active
          },
          csImg:CSimg,
          usImg:USimg,
          btnStatus:'right',
          chatRecords:[  //历史会话记录
            {
                startTime:'2025-03-04 10:30',
                title:'黑科技范德萨李海峰阿斯利康多久发货打发了啊啊时间到了反馈hj',
                historyRecord:[
                    {type:'text',dateTime:'2025-05-15 19:11',Identity:'other',content:'你好,',quoteContent:''},
                    {type:'text',dateTime:'2025-05-15 19:11',Identity:'self',content:'你好伺服电机',quoteContent:'合规经理快递费说过话的'}
                ]
            },
            {
                startTime:'2025-03-04 10:30',
                title:'黑科技范德萨李海峰阿斯利康多久发货打发了啊啊时间到了反馈hj',
                historyRecord:[
                    {type:'text',dateTime:'2025-05-15 19:11',Identity:'other',content:'你好,甲方黑客技术东方红',quoteContent:''},
                    {type:'text',dateTime:'2025-05-15 19:11',Identity:'self',content:'你好伺服电机哈师大打开了时间啊啊看手机电话费',quoteContent:''}
                ]
           },
            {startTime:'2025-03-04 10:30',title:'黑科技范德萨李海峰阿斯利康多久发货打发了啊啊时间到了反馈hj'},
            {startTime:'2025-03-04 10:30',title:'黑科技范德萨李海峰阿斯利康多久发货打发了啊啊时间到了反馈hj'},
            {startTime:'2025-03-04 10:30',title:'黑科技范德萨李海峰阿斯利康多久发货打发了啊啊时间到了反馈hj'},
            {startTime:'2025-03-04 10:30',title:'黑科技范德萨李海峰阿斯利康多久发货打发了啊啊时间到了反馈hj'},
            {startTime:'2025-03-04 10:30',title:'黑科技范德萨李海峰阿斯利康多久发货打发了啊啊时间到了反馈hj'},
            {startTime:'2025-03-04 10:30',title:'黑科技范德萨李海峰阿斯利康多久发货打发了啊啊时间到了反馈hj'},
            {startTime:'2025-03-04 10:30',title:'黑科技范德萨李海峰阿斯利康多久发货打发了啊啊时间到了反馈hj'},
          
         ],
         isViewHistory:false, //是否查看点击历史记录
         currentChatContent:[],//当前最新连天信息存储
         historyChatContent:[],//历史聊天记录
         files:{
            name:'',
            size:'',
            direction:'',
            width:'',
            height:'',
            imageUrl:null,
         }
        }
    },
    computed:{
        chatContent(){//聊天信息框内容
           return this.isViewHistory ? this.historyChatContent : this.currentChatContent
        },
        // 左侧会话记录原分页滑动逻辑
        // newRecord(){ 
        //     let arr = []
        //     let num = Math.ceil(this.chatRecords.length/5)
        //     for(var i=0; i<num; i++){
        //         var obj = {}
        //         var newArr = this.chatRecords.filter((item,index) => {
        //             return index >= i*5 && index < (i+1)*5
        //         })
        //         obj.records = [...newArr]
        //         arr.push(obj)
        //     }
        //     return arr
        // },
        getStatusColor(){
             var color=''
             switch(this.isInline){
                case 'inLine':
                    color='#19be6b'
                    break;
                case 'Busy':
                    color='#ed4014'
                    break;
                default:
                    color='#dcdee2'
             }
             return color
        },
        getStatusText(){
             return this.statusList.filter(item => this.isInline == item.value)[0].label
        }
    },
    mounted(){
      if(this.isInline == 'inLine'){
        var CSname = this.chatPerson
        this.otherReply(`我是${CSname}，请问有什么可以帮您`)
        var obj = {
            startTime:this.getCurrentDate(),
            title:'当前最新会话',
            historyRecord:[]
        }
        setTimeout(() => {
            this.chatRecords.unshift(obj)
        },1000)
      }else if(this.isInline == 'Busy'){
            this.warningMessage = '当前客服繁忙中，将稍后回复您的问题!'
      }else{
          this.warningMessage ='当前客服已离线，您可以咨询留言'
      }
    },
    methods:{
        handlePaste(event) {
            // 阻止默认的粘贴行为
            event.preventDefault();
            // 获取剪贴板内容
            const clipboardData = event.clipboardData || window.clipboardData;
            const items = clipboardData.items;
            const pastedItems = [];
            // 检查每个项是否为图片
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                    const blob = items[i].getAsFile(); // 获取文件对象
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = document.createElement('img'); // 创建 img 元素
                        img.src = e.target.result; // 设置图片源为读取结果
                        img.style.maxWidth = '100px'; // 设置最大宽度
                        img.style.maxHeight = '100px'; // 设置最大高度
                        this.insertAtCaret(img); // 在光标位置插入图片
                    };
                    reader.readAsDataURL(blob); // 读取文件内容为 URL
                } else {
                    // 非图片内容，可以尝试插入文本等其他内容
                    document.execCommand('insertText', false, clipboardData.getData('text/plain'));
                }
            }
        },
        insertAtCaret(element) {
        // 获取当前光标位置并插入元素
            const selection = window.getSelection();
            if (selection.rangeCount) {
                selection.getRangeAt(0).insertNode(element);
                // 将光标移至插入元素之后
                const range = document.createRange();
                range.setStartAfter(element);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        },
        sendImg(){
            var obj = {type:'image',dateTime:this.getCurrentDate(),Identity:'self',direction:this.files.direction,imageUrl:this.files.imageUrl}
            this.currentChatContent.push(obj)
            this.fileModal = false 
        },
        cancelFileModal(){
            this.fileModal = false
            this.files = {
                name:'',
                size:'',
                direction:'',
                imageUrl:null,
            }
        },
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        handleFileChange(e) {
           this.fileModal = true
           let file = e.target.files[0]
           if(!file) {
                return; // 如果没有文件被选择，则直接返回
            }
            this.createImage(file); // 调用创建图片的方法
        },
        createImage(file) {
            const reader = new FileReader(); // 创建一个FileReader实例
            reader.onload = (e) => { // 读取完成后的回调函数
                this.files.imageUrl = e.target.result; // 设置图片URL到data属性中
                this.getImageDimensions(e.target.result)
            };
            this.files.name = file.name
            this.files.size = formatBytes(file.size)
            reader.readAsDataURL(file); // 读取文件内容为DataURL
            document.querySelector("#fileInput").setAttribute('type', 'text');
            setTimeout(() => {
                document.querySelector("#fileInput").setAttribute('type', 'file')
            },1000)
        },
        getImageDimensions(base64) {
            const img = new Image();
            img.onload = () => {
                const width = img.naturalWidth;
                const height = img.naturalHeight;
                if(width > height){
                    this.files.direction = 'horizontal'
                }else{
                    this.files.direction = 'vertical'
                }
            };
            img.src = base64; // 注意这里用的是Base64 URL，不是Blob URL
            
        },
        defineEndConversation(){
          this.isCureentEndSeesion = false
          this.isEvaluationEnd = true
        },
        cancelevaluate(){
           this.isCureentEndSeesion = true
        },
        clickEvaluate(index){
           if(index == 0){
                this.evaluateImg.isEvaluate = !this.evaluateImg.isEvaluate
                this.evaluateImg.isEvaluate1 = false
                this.evaluateImg.isEvaluate2 = false
                this.evaluateImg.isEvaluate3 = false
           }else if(index == 1){
               this.evaluateImg.isEvaluate = false
               this.evaluateImg.isEvaluate1 = !this.evaluateImg.isEvaluate1
               this.evaluateImg.isEvaluate2 = false
               this.evaluateImg.isEvaluate3 = false
           }else if(index == 2){
                this.evaluateImg.isEvaluate = false
                this.evaluateImg.isEvaluate1 = false
                this.evaluateImg.isEvaluate2 = !this.evaluateImg.isEvaluate2
                this.evaluateImg.isEvaluate3 = false
           }else if(index == 3){
                this.evaluateImg.isEvaluate = false
                this.evaluateImg.isEvaluate1 = false
                this.evaluateImg.isEvaluate2 = false
                this.evaluateImg.isEvaluate3 = !this.evaluateImg.isEvaluate3
           }else{}
        },
        clickEndSesseion(){
           this.isCureentEndSeesion = false
        },
        handlekeydown(event) {
            if (event.ctrlKey && event.key === 'Enter') {
                //如果按下 Ctrl + 回车，允许默认换行行为
                event.preventDefault(); // 阻止默认的换行行为
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                // range.deleteContents(); // 删除选中的内容（如果有）
                range.insertNode(document.createElement('br')); // 插入换行符
                range.setStartAfter(range.endContainer.lastChild); // 将光标移动到下一行
                range.setEndAfter(range.endContainer.lastChild);
                selection.removeAllRanges(); // 移除选区
                selection.addRange(range); // 重新设置选区
            } else if (event.key === 'Enter') {
                // 普通回车键，执行换行或其它操作
                event.preventDefault(); // 阻止默认的换行行为
                this.sendContent()
                // if(this.$refs.self_input_content.innerText.trim() !== ''){
                //     this.sendContent()
                // }
               
            }
        },
        clickRecord(item,index){
           this.activeIndex = index
           if(index !== 0){
             this.isViewHistory = true
             this.historyChatContent = item.historyRecord
           }else{
            this.isViewHistory = false
           }
         
        },
        //引用
        doQuote(){
            this.quoteMessage = ''
            if(this.contextContent.target.innerText){
               this.$refs.self_input_content.focus();
               this.quoteMessage = this.contextContent.target.innerText
               var parentDiv = document.getElementById('selfInput')
               var elements = document.querySelector('.quoteMessage_box');
               if (elements && elements.classList.contains('quoteMessage_box')) { // 检查元素是否存在以及是否包含'selfInput'类
                        elements.parentNode.removeChild(elements);
                }else{
                    var br = document.createElement("br");
                    parentDiv.appendChild(br);
                }
                var div = document.createElement("div");
                div.className = 'quoteMessage_box';
                div.setAttribute('style','display: inline-block;background-color:#e2e2e2;padding: 5px 10px;border-radius: 5px;')
                div.setAttribute('contenteditable','false')
                div.textContent=this.quoteMessage
                parentDiv.appendChild(div)
                this.isShowModal = false
            }
        },
        //复制
        doCopy(){
            this.copyMessage = ''
            if(this.contextContent.target.innerText){
               this.copyMessage = this.contextContent.target.innerText
            }
            this.$copyText(this.copyMessage).then(res => {
                this.$Message.success('复制成功！')
                console.log(res)
            }, err => {
               this.$Message.error('复制失败！')
            })
            this.isShowModal = false
        },
        //发送输入内容
        sendContent(){
            var quoteHtml=''
            var elements = document.querySelector('.quoteMessage_box');
            if(elements){
                quoteHtml = elements.innerHTML
                elements.parentNode.removeChild(elements);
            }
           
            // 获取所有<img>元素
            var parentDiv = document.getElementById('selfInput')
            const imgs = parentDiv.querySelectorAll('img');
            if(imgs.length !== 0){
                // 遍历这些元素并打印它们的src属性
                imgs.forEach(img => {
                    this.getImageDimensions(img.src)
                    var obj = {type:'image',dateTime:this.getCurrentDate(),Identity:'self',direction:this.files.direction,imageUrl:img.src}
                    this.currentChatContent.push(obj)
                });
            }

            let inputText = this.$refs.self_input_content.innerText
            if(inputText.trim() == ''){
                return
            }
            let valueArr = inputText.split('\n')
            let newValue = ''
            valueArr.forEach((item,index) => {
                if(index == valueArr.length -1){
                   newValue=newValue+item
                }else{
                   newValue=newValue+item+'<br/>'
                }
            });
            var obj = {
                type:'text',
                dateTime:this.getCurrentDate(),
                Identity:'self',
                content:newValue,
                quoteContent:quoteHtml
            }
            this.currentChatContent.push(obj)
            this.goRollBottom()
            this.$refs.self_input_content.innerHTML=''
            this.otherReply('你好，请问你遇到什么问题，我这里有什么可以帮助到你的吗？ ')
        },
        goRollBottom(){
            this.$nextTick(() => {
                const ulElement = this.$refs.session_box;
                ulElement.scrollTop = ulElement.scrollHeight;
            });
        },
        otherReply(valuehtml){
            let replyContent = valuehtml
              let obj =  {
                type:'text',
                dateTime:this.getCurrentDate(),
                Identity:'other',
                content:replyContent,
                quoteContent:''
                }
            if(this.isInline == 'inLine'){
                setTimeout(() => {
                this.currentChatContent.push(obj)
                this.$nextTick(() => {
                        const ulElement = this.$refs.session_box;
                        ulElement.scrollTop = ulElement.scrollHeight;
                    });
                },1000)
            }
        },
        getCurrentDate(){
            const date = new Date()
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
        },
    
        //左侧原分页会话记录点击切换分页事件
        // changeIndex(index){
        //     var  activeIndex =  this.currentIndex + index 
        //     if(activeIndex < 0){
        //       this.currentIndex = 0
        //     }else if(activeIndex > this.newRecord.length - 1){
        //       this.currentIndex = this.newRecord.length -1
        //     }else{
        //       this.currentIndex = activeIndex
        //       this.btnStatus = 'both'
        //       if(this.currentIndex == 0){
        //          this.btnStatus = 'right'
        //       }
        //       if(this.currentIndex ==  this.newRecord.length -1){
        //          this.btnStatus = 'left'
        //       }
        //     }
        // } 
        onRightClick(e){
            this.contextContent = e
            this.isShowModal = false
            // 获取浏览器窗口的可视区域宽度（包括滚动条等）
            var clientWidth = document.documentElement.clientWidth;
            this.$nextTick(() => {
                this.isShowModal = true
                const modalWidth = this.$refs.modalRef.offsetWidth !== 0 ? this.$refs.modalRef.offsetWidth : '90'
                if(clientWidth - e.clientX < modalWidth){
                  this.leftWidth = e.clientX - modalWidth
                }else{
                  this.leftWidth = e.clientX + 2
                }
                  this.topWidth = e.clientY + 2
            });
        },
        clicktabModal(){
            if(this.isShowModal){
                this.isShowModal = false
            }
        },
       
    }

}
</script>

<style lang="less" scoped>
.chat_content_box{
    width: 100%;
    height: 100%;
    position: relative;
    .maskModal{
        width: 70%;
        height: 85%;
        border-radius: 4px;
        position:fixed;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        display: flex;
        .left_info_box{
            width:250px;
            height: 100%;
            border-radius: 4px 0 0 4px;
            background-color: #fff;
            .otherInfo_box{
                width: 100%;
                height: 135px;
                // background-color: pink;
                box-sizing: border-box;
                padding: 0 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-top: 30px;
                .avatar{
                    width: 49px;
                    height: 49px;
                    position: relative;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                    .circle_status{
                       width: 12px;
                       height: 12px;
                       border-radius: 50%;
                       cursor: pointer;
                       position: absolute;
                       right: 2px;
                       bottom: 2px;
                       z-index: 10;
                    }
                }
                .timeRange{
                    color: #9c9c9c;
                    font-weight: 700;
                }
            }
            .chat_records{
                padding: 0 10px;
                height: calc(100% - 165px);
                display: flex;
                flex-direction: column;
                align-items: center;
                .records_carousel{
                    width: 100%;
                    height: calc(100% - 70px);
                    margin-top: 5px;
                    overflow-x: auto;
                    .records_ul{
                        width: 100%;
                        position: relative;
                        li{
                            display: flex;
                            flex-direction: column;
                            padding: 5px;
                            border-radius: 5px;
                            cursor: pointer;
                            .time_img{
                                display: flex;
                                align-items: center;
                               img{
                                margin-left: 20px;
                                 height: 18px;
                                 width: 18px;
                               }
                            }
                            .record{
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                margin-left:10px;
                            }
                        }
                        li:hover{
                            background-color: #f5fcff;
                        } 
                        .active_li{
                            color:#2db7f5
                        }
                        .firstActive{
                            position: sticky;
                            background-color: #fff;
                            top:0;
                        }
                    }
                   
                   /* .ivu-carousel{  //左侧原分页会话记录样式
                        height: 100%;
                        width: 100%;
                        .demo-carousel{
                            width: 100%;
                            li{
                                display: flex;
                                flex-direction: column;
                                padding: 5px 0;
                                .record{
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    margin-left:10px;
                                }
                            }
                        }
                    } */
                    
                }
                .records_carousel::-webkit-scrollbar {
                   width: 0px;
                }
            }
           
        }
        .right_chat_box{
            width:calc(100% - 250px);
            height: 100%;
            border-radius:0 4px 4px 0;
            background-color: rgb(229, 242, 252);
            .chat_header_box{
                height: 67px;
                width: 100%;
                // background-color: pink;
                .header_btns_box{
                   height: 30px;
                   display: flex;
                   justify-content: flex-end;
                   align-items: center;
                   li{
                      height: 100%;
                      width: 35px;
                      display: flex;
                      justify-content: space-around;
                      align-items: center;
                      cursor: pointer;
                   }
                   li:hover{
                    background-color: #e2e2e2;
                   }
                   li:last-child:hover{
                      background-color: #ff9494;
                   }
                }
                .system_type{
                    height: 37px;
                    line-height: 37px;
                    width: 96%;
                    margin-left: 2%;
                    padding: 0 20px;
                    background-color: #fff;
                    border-radius: 5px;
                    .system_name{
                        padding: 6px 10px;
                        color: #2db7f5;
                        border: 1px solid #2db7f5;
                        border-radius: 5px;
                    }
                }
            }
            .chating_box{
                height: calc(100% - 87px);
                box-sizing: border-box;
                margin: 10px 20px;
                position: relative;
                .session_box{
                   height:100%;
                   width: 100%;
                   overflow-y: auto;
                   .session_chat_ul{
                     padding-bottom: 120px;
                     li{
                        width: 100%;
                        margin-bottom: 20px;
                        .other_content_box{
                             width: 100%;
                            .other_info_box{
                                display: flex;
                                align-items: center;
                                .otherImg{
                                    height: 30px;
                                    width: 30px;
                                    img{
                                        height: 100%;
                                        width: 100%;
                                    }
                                }
                            }
                            .other_chat_content{
                                display: flex;
                                justify-content: flex-start;
                                margin-top: 5px;
                                .other_word_content:hover{
                                   background-color: #f3f3f3;
                                }
                                .content{
                                   margin:0 30px;
                                   padding:6px 10px;
                                   border-radius: 15px; 
                                   background-color: #fff;
                                   
                                }  
                                .quote_chat_content{
                                   background-color: #d8d8d8;
                                }    
                            }
                        }
                        .self_content_box{
                            width: auto;
                            .self_info_box{
                                display: flex;
                                justify-content: flex-end;
                                align-items: center;
                                .selfImg{
                                    height: 30px;
                                    width: 30px;
                                    img{
                                        height: 100%;
                                        width: 100%;
                                    }
                                }
                            }
                            .self_chat_content{
                                display: flex;
                                justify-content: flex-end;
                                margin-top: 5px;
                                .sef_word_content:hover{
                                     background-color: #f3f3f3;
                                }
                                .content{
                                   margin:0 30px;
                                   padding:6px 10px;
                                   border-radius: 15px; 
                                   background-color: #fff;
                                   .vertical_div{
                                      height:200px;
                                      img{
                                        height:100%;
                                      }
                                   }
                                   .horizontal_div{
                                      width:200px;
                                      img{
                                        width:100%;
                                      }
                                   }
                                }
                                .quote_chat_content{
                                   background-color: #d8d8d8;
                                }                           
                            }
                        }
                     }
                     .systemWarning{
                        margin-top: 10px;
                        text-align: center;
                        color:#adadad
                    }
                   }
                }
                .session_box::-webkit-scrollbar {
                   width: 0px;
                }
                .input_box{
                   height: 100px;
                   width: 100%;
                   background-color: #fff;
                   border-radius: 5px;
                   box-sizing: border-box;
                   position: absolute;
                   left:0px;
                   bottom:0px;
                   padding: 5px 10px;
                   .input_content{
                     height: 100%;
                     width: 100%;
                     outline: none;
                     border-radius: 5px;
                     overflow-x: auto;
                     .quoteMessage_box{
                        display: inline-block;
                        background-color:#e2e2e2;
                        padding: 5px 10px;
                        border-radius: 5px;
                    }
                   }
                   
                   .btns_ul{
                      position: absolute;
                      left: 0;
                      top:-36px;
                      display: flex;
                      li{
                        padding: 5px 12px;
                        border-radius: 10px;
                        background-color: #fff;
                        margin-right: 10px;
                        color:#999999;
                        cursor: pointer;
                      }
                      li:hover{
                        background-color: #f3f3f3;
                        color:#555555;
                    }
                   }
                   .action_btns{
                      position: absolute;
                      right: 10px;
                      bottom:10px;
                      display: flex;
                      li{
                        padding: 5px 15px;
                        border-radius: 5px;
                        background-color: #4cadfc;
                        margin-left: 10px;
                        cursor: pointer;
                      }
                      li:hover{
                         background-color: #6bbafa;
                      }
                   }
                }
                .service_evaluation_box{
                   height: 200px;
                   width: 100%;
                   background-color: #fff;
                   border-radius: 5px;
                   box-sizing: border-box;
                   position: absolute;
                   left:0px;
                   bottom:0px;
                   padding: 10px;
                   display: flex;
                   flex-direction: column;
                    align-items: center;
                    justify-content: space-around;
                   .evaluation_title{
                        font-size: 20px;
                        font-weight: 700;
                        color:#000;
                   }
                   .evaluation_ul{
                      display: flex;
                      li{
                        margin: 10px 20px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        img{
                            height: 50px;
                            width: 50px;
                            margin-bottom: 10px;
                            cursor: pointer;
                        }
                      }
                   }
                   .btns{
                     width: 50%;
                     display: flex;
                     justify-content: space-around;
                   }
                }
            }
        }
    }
}
.slide-down-enter-active, .slide-down-leave-active {
  transition: transform 0.2s, opacity 0.2s,height 0.2s;
}
.slide-down-enter-from, .slide-down-leave-to {
  transform: translateY(-5px);
  opacity: 0;
  height: 0;

}
.tabsModal{
  position: fixed;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, .1);
  padding:10px 5px;
  ul{
    li{
      padding: 5px 20px 5px 12px;
      font-size: 14px;
      color: #73767a;
      cursor: pointer;
    }
    li:hover{
      background-color:#f8f8f8 ;
      border-radius:4px ;
    }
  }
}

.fileModal_btns{
    width:100%;
    display:flex;
    justify-content:space-around;
    /deep/.ivu-btn{
        padding:0 40px
    }
}
.files_ul{
    padding-bottom:20px;
    li{
     display:flex;
     align-items:center;
     justify-content:space-between;
     cursor:pointer;
     .file_info{
        display:flex;
        align-items:center;
        img{
            height:45px;
            width:45px;
        }
        .file_name{
            margin-left:15px;
            width:200px;
            .names{
                white-space:nowrap;
                overflow:hidden;
                text-overflow:ellipsis;
            }
        }
     }
     .deletebtn{
        display:none;
     }
    }
    li:hover{
        .deletebtn{
            display:block;
        }
    }
}

/* 修改滚动条的宽度和颜色 */
::-webkit-scrollbar {
    width: 6px; /* 滚动条的宽度 */
    height: 6px; /* 滚动条的高度 */
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  background-color: rgb(194, 194, 194,.5); /* 滑块颜色 */
  border-radius: 10px; /* 滑块圆角 */
}
/* 去掉上下箭头 */
::-webkit-scrollbar-button {
   display: none; /* 隐藏上下箭头 */
}
.quoteMessage_box{
    display: inline-block;
    background-color:#e2e2e2;
    padding: 5px 10px;
    border-radius: 5px;
}
</style>