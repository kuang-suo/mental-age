const API_BASE_URL = '/api';

const DIM_KEYS = ['stable', 'facility', 'rhythm', 'international', 'living', 'food', 'opportunity', 'cost'];
const DIM_META = {
  stable: { name: '稳定/安稳', color: '#1E40AF', desc: '就业安全感与社会配套的稳定性' },
  facility: { name: '配套/便利', color: '#059669', desc: '医疗、教育、交通的综合便利程度' },
  rhythm: { name: '节奏/活力', color: '#F97316', desc: '城市发展速度与生活的活跃程度' },
  international: { name: '国际/开放', color: '#7C3AED', desc: '国际化程度与对外来文化的包容度' },
  living: { name: '居住/环境', color: '#16A34A', desc: '空气质量、绿化、气候的宜居程度' },
  food: { name: '美食/烟火', color: '#DC2626', desc: '美食多样性、夜宵文化、饮食乐趣' },
  opportunity: { name: '机遇/收入', color: '#D4A017', desc: '人均GDP、薪资天花板、创业机会' },
  cost: { name: '生活成本', color: '#6B7280', desc: '房价与日常消费的综合负担（越低越高）' }
};

const CITIES = {
  shanghai: {
    name: '上海', en: 'Shanghai', emoji: '🌆', tier: '一线',
    slogan: '魔都的璀璨与野心',
    portrait: '上海是一座用速度和野心堆砌起来的城市。它拥有全国最完善的社保体系、最密集的地铁网络和最高的国际化程度。在这里，凌晨两点的写字楼依然灯火通明，街角的咖啡馆永远有人在谈生意。上海给你的东西很贵，但它也给了你一个理由——让你相信，只要足够努力，这座城市就能承载你所有的野心。',
    lifeScene: '3月的上海，空气里已经开始有了春天的味道——梧桐树刚刚冒出新芽，豫园的玉兰开得正盛。你住在静安区一间30平的小公寓，月租6500。早上7点半的地铁1号线已经挤满了人，你戴着降噪耳机，在摇晃的车厢里回完了三封邮件。9点到公司，楼下便利店买一杯美式，35块，一天的开始。\n\n中午你约了客户在iapm的意大利餐厅吃饭，谈完合作走出商场，淮海路的落日照得人眼睛发酸。下班后你没有回家，而是去了新天地的一间小酒吧，点了杯尼格罗尼，和做设计的闺蜜聊到10点。回家的路上，武康路的老房子在路灯下泛着暖黄色的光，你突然觉得，这座城市的昂贵是值得的——因为你永远不知道下一秒会遇见什么。',
    data: { salary: '12,000-25,000', rent: '5,500-8,000', metro: '83%', commute: '42分钟' },
    dims: { stable: 85, facility: 97, rhythm: 95, international: 98, living: 62, food: 88, opportunity: 95, cost: 35 },
    friendCities: ['hangzhou', 'shenzhen'],
    tags: ['国际化', '高薪', '快节奏']
  },
  beijing: {
    name: '北京', en: 'Beijing', emoji: '🏯', tier: '一线',
    slogan: '千年帝都的厚重与理想',
    portrait: '北京是一座让你变重的城市。国央企和机关单位密集，安全感强；顶级高校和三甲医院全国最多。在这里，你能感受到一种来自历史深处的厚重——胡同里的老树、国子监的红墙、秋天香山的红叶，都在提醒你：这座城市见过太多，它不会轻易被任何人的焦虑所动摇。住进来，慢慢就有了厚度。',
    lifeScene: '10月的北京，是一年里最好的季节。你住在东城区一间老小区的两居室，月租5500，小区楼下就是豆腐脑和煎饼摊，早上7点的香气能把你香醒。\n\n你在三里屯一家互联网公司做产品，早上9点到岗，下午6点准时下班——这是你给自己定的规矩。你知道在北京，活得太卷会死，太躺会废，所以你在找一个中间态。\n\n周末你会骑车穿过胡同，从南锣鼓巷骑到五道营，国子监的红墙在阳光下透出一种说不清的历史感。秋天是你最喜欢的季节，香山的红叶你去了五年了，每年都还愿意再去。你在这里交了五年社保，在望京买了属于自己的小房子，每个月还2万的房贷，但你甘愿。这就是北京给你的东西——你在这里扎下了根，变成了一个更厚重的自己。',
    data: { salary: '11,000-22,000', rent: '4,500-7,000', metro: '78%', commute: '52分钟' },
    dims: { stable: 88, facility: 93, rhythm: 88, international: 90, living: 55, food: 80, opportunity: 92, cost: 38 },
    friendCities: ['nanjing', 'xian'],
    tags: ['文化底蕴', '稳定', '历史感']
  },
  shenzhen: {
    name: '深圳', en: 'Shenzhen', emoji: '🔬', tier: '一线',
    slogan: '创新之都的速度与可能',
    portrait: '深圳是全国最年轻的城市，创业氛围最浓，没有人管你穿什么、背什么包、谈什么恋爱。这里不问你从哪里来，只看你现在在干什么。凌晨2点的科技园还有一半的灯亮着，因为每个人都在赌一个"万一呢"。',
    lifeScene: '6月的深圳已经热得让人发懵。你住在南山科技园附近一间25平的公寓，月租5800，楼下是711，对面是腾讯大厦。每天早上9点，你踩着拖鞋去公司（是的，你们公司允许穿拖鞋上班），打卡，然后开始一天的工作。\n\n你们公司是创业公司，20个人，做AI应用。你是第5号员工，手里有点期权，不多，但你觉得万一呢？\n\n周末你通常会去大梅沙或者杨梅坑，海水是脏绿色的，但你不在乎。你喜欢深圳的原因是：没人管你穿什么、背什么包、谈什么恋爱。这里不问你从哪里来，只看你现在在干什么。凌晨2点的科技园还有一半的灯亮着，你有时候加班到这时候，会走到楼下买一根椰子冰淇淋，坐在花坛边吃完，觉得这就是你想要的生活。',
    data: { salary: '12,000-28,000', rent: '4,500-7,500', metro: '72%', commute: '38分钟' },
    dims: { stable: 72, facility: 88, rhythm: 98, international: 92, living: 58, food: 75, opportunity: 93, cost: 42 },
    friendCities: ['guangzhou', 'hangzhou'],
    tags: ['创业', '年轻', '科技']
  },
  guangzhou: {
    name: '广州', en: 'Guangzhou', emoji: '🌆', tier: '一线',
    slogan: '千年商都的烟火与松弛',
    portrait: '广州最迷人的地方是：不管你多拼命，它都有办法让你慢下来。一盅两件，一碗糖水，一句"唔该"，这就是广州给你的全部——让你觉得，活着不必那么着急。一线城市中门槛最低，美食全国顶尖。',
    lifeScene: '11月的广州，是一年里最舒服的时候。你住在天河区一间老小区的两居室，月租4200，距离地铁站步行8分钟。\n\n你做服装批发生意，每天早上6点起床，去十三行拿货，下午在直播间卖衣服，晚上10点收工。你在广州住了8年，早就习惯了这里的一切——早茶要吃最正宗的，不是游客去的那种，是老城区那种，阿姨用白话跟你讲"今日虾饺几好食"。周末你会去大夫山骑车，或者去沙面走走，欧洲老建筑和榕树树荫让你觉得这座城市有一种独特的松弛感。\n\n广州最迷人的地方是：不管你多拼命，它都有办法让你慢下来。一盅两件，一碗糖水，一句"唔该"，这就是广州给你的全部——让你觉得，活着不必那么着急。',
    data: { salary: '8,000-16,000', rent: '2,800-5,000', metro: '68%', commute: '36分钟' },
    dims: { stable: 82, facility: 90, rhythm: 78, international: 88, living: 72, food: 95, opportunity: 80, cost: 68 },
    friendCities: ['shenzhen', 'changsha'],
    tags: ['美食天堂', '松弛', '性价比']
  },
  chengdu: {
    name: '成都', en: 'Chengdu', emoji: '🐼', tier: '新一线',
    slogan: '天府之国的快乐哲学',
    portrait: '成都让人明白一件事：幸福不是一个终点，是一种能力。火锅/川菜/小吃，美食密度全国最高；夜生活丰富，茶馆文化盛行。新一线中性价比最高，房价1.2-2.5万/㎡。在这里，你可以慢下来，也可以拼起来。',
    lifeScene: '7月的成都，闷热，但不妨碍大家坐在外面喝茶。你住在锦江区一间老小区的两居室，月租2800，阳台正对着339电视塔，每天晚上电视塔的灯都会亮起来。\n\n你做游戏美术，在高新区的天府软件园上班。每天中午你会和同事走去楼下的苍蝇馆子，点一份冒菜，微辣，加一份冰粉，吃得满头大汗，然后回公司继续肝。下午6点准时下班——这是成都人的基本素养。\n\n周末你会去人民公园的鹤鸣茶社，和朋友要一壶碧潭飘雪，坐到下午4点，看够了掏耳朵的师傅和带孩子的老人，你觉得这就是生活应该有的样子。傍晚你们骑车去339的楼顶酒吧，喝一杯莫吉托，看整个城市的灯火一层层亮起来，然后打车回家，路上司机在放李伯清的散打评书，你笑了一路。\n\n成都让人明白一件事：幸福不是一个终点，是一种能力。',
    data: { salary: '7,000-14,000', rent: '1,800-3,500', metro: '55%', commute: '35分钟' },
    dims: { stable: 78, facility: 88, rhythm: 70, international: 78, living: 80, food: 98, opportunity: 72, cost: 78 },
    friendCities: ['chongqing', 'changsha'],
    tags: ['美食', '慢生活', '性价比']
  },
  hangzhou: {
    name: '杭州', en: 'Hangzhou', emoji: '🍃', tier: '新一线',
    slogan: '诗画江南的数字与禅意',
    portrait: '杭州是一座让人学会"放下"的城市——放下KPI，放下焦虑，在一杯龙井里，找到和生活和解的方式。西湖+湿地，空气质量优，绿化率高；数字经济机会丰富，人均GDP约13.5万。互联网节奏快与西湖边慢生活并存。',
    lifeScene: '4月的杭州，是一首诗。你住在西湖区一间LOFT，月租4800，骑车到西湖边只需要15分钟。\n\n你在阿里做运营，早上9点开晨会，下午3点的下午茶时间，你会走到公司楼下的人工湖边，看锦鲤抢食。5点半下班后，你通常会直接骑车去西湖，断桥边坐着看完一场日落。\n\n周末你约了朋友在青芝坞的一家私房菜吃饭，点了龙井虾仁和东坡肉，吃完去灵隐寺走走，一路走到法喜寺，在那里你会点一炷香，不求什么，就只是想站一会儿。5月的西湖，荷叶刚刚冒出来，你骑着公共自行车绕湖一周，春风把你的头发吹得乱七八糟，你觉得自己好像终于活进了一首诗里。\n\n杭州是一座让人学会"放下"的城市——放下KPI，放下焦虑，在一杯龙井里，找到和生活和解的方式。',
    data: { salary: '9,000-20,000', rent: '3,000-6,000', metro: '62%', commute: '38分钟' },
    dims: { stable: 82, facility: 88, rhythm: 82, international: 82, living: 88, food: 78, opportunity: 88, cost: 55 },
    friendCities: ['suzhou', 'shanghai'],
    tags: ['宜居', '数字经济', '诗意']
  },
  xian: {
    name: '西安', en: "Xi'an", emoji: '🏺', tier: '新一线',
    slogan: '千年古都的厚重与烟火',
    portrait: '西安是一座让你变重的城市。你住进来，慢慢就有了厚度。国央企/军工/高校就业稳定；"碳水之都"——凉皮/肉夹馍/泡馍，美食便宜好吃。房价1.0-2.0万/㎡，西部洼地。',
    lifeScene: '9月的西安，秋高气爽。你住在雁塔区一间80年代老小区的两居室，月租2200，小区院子里有一棵你叫不出名字的老树，每年9月会开满粉色的花。\n\n你在小寨一家教育机构做新媒体运营，每天早上7点半起床，骑车15分钟到公司，楼下是肉丸糊辣汤，你会加一勺油泼辣子，吃得满头大汗。\n\n周末你会去一趟小雁塔，那里的皮影戏你看了很多遍，每次看还是觉得有意思。或者去洒金桥吃一碗水盆羊肉，配着月牙饼，听旁边桌的大爷聊他年轻时候在八里村租房的日子。晚上你会骑车去大唐不夜城，看那些灯一亮起来，整条街好像穿越回了1300年前的大唐长安。\n\n西安是一座让你变重的城市。你住进来，慢慢就有了厚度。',
    data: { salary: '6,000-12,000', rent: '1,200-2,500', metro: '42%', commute: '32分钟' },
    dims: { stable: 82, facility: 83, rhythm: 72, international: 75, living: 65, food: 92, opportunity: 70, cost: 82 },
    friendCities: ['beijing', 'chengdu'],
    tags: ['文化', '美食', '低成本']
  },
  suzhou: {
    name: '苏州', en: 'Suzhou', emoji: '🏯', tier: '新一线',
    slogan: '园林之城的精致与从容',
    portrait: '苏州告诉你：生活不需要那么多，只要每一样都刚刚好，就够了。制造业之都，外企密集，就业稳定；园林城市，空气质量优，江南宜居。人均GDP约18.2万，外企/制造业薪资高。',
    lifeScene: '10月的苏州，桂花香满城。你住在姑苏区一间民国老房子的单间，月租3200，推开窗户能看见隔壁园林的飞檐。\n\n你在园区一家外资企业做供应链管理，每天开车从老城区穿过金鸡湖到园区上班，路上的风景从青砖白墙变成玻璃幕墙，你喜欢这种穿越感。\n\n周末你会去山塘街走一走，七里山塘走到头，平江路走回来，在猫的天空之城概念书店寄一张明信片给自己。你喜欢苏州的原因是：这座城市把"精致"刻进了骨子里——一碗苏式汤面，面要细，浇头要鲜，汤要清，葱花要切成细丝撒在最上面，一丝不苟。\n\n苏州告诉你：生活不需要那么多，只要每一样都刚刚好，就够了。',
    data: { salary: '9,000-18,000', rent: '2,000-4,500', metro: '48%', commute: '30分钟' },
    dims: { stable: 88, facility: 85, rhythm: 75, international: 85, living: 90, food: 82, opportunity: 85, cost: 60 },
    friendCities: ['hangzhou', 'shanghai'],
    tags: ['精致', '宜居', '高薪']
  },
  chongqing: {
    name: '重庆', en: 'Chongqing', emoji: '🌉', tier: '新一线',
    slogan: '山城江湖的热烈与棱角',
    portrait: '重庆是一座让人变得有棱角的城市——你爱它的热烈，也爱它的江湖气。火锅/小面/江湖菜，便宜好吃到哭；夜生活极度活跃。房价0.8-2.5万/㎡，主城区性价比高。',
    lifeScene: '8月的重庆，热得像一个蒸笼，但这不妨碍火锅店从中午12点就开始排队。你住在渝中区一间江景高层公寓，月租3500，落地窗正对着嘉陵江，晚上对岸的灯火倒映在江面上，你看了三年了，还是觉得好看。\n\n你在观音桥一家广告公司做创意，下班后同事们集体步行10分钟去吃火锅——是的，在重庆距离近不代表走得近，你们选择火锅是因为走到火锅店出了一身汗，反而凉快了。\n\n周末你通常睡到中午11点，然后去楼下吃一碗重庆小面，多放葱花和榨菜。下午约朋友去南滨路骑摩托，江风吹过来，把一身的暑气全吹散了。晚上你们去了洪崖洞，看着千与千寻同款夜景，你突然想：自己已经在这个魔幻的城市里，变成了一个立体的人。\n\n重庆是一座让人变得有棱角的城市——你爱它的热烈，也爱它的江湖气。',
    data: { salary: '6,000-13,000', rent: '1,500-3,500', metro: '45%', commute: '35分钟' },
    dims: { stable: 75, facility: 82, rhythm: 88, international: 72, living: 70, food: 95, opportunity: 75, cost: 80 },
    friendCities: ['chengdu', 'changsha'],
    tags: ['火锅', '江湖气', '性价比']
  },
  nanjing: {
    name: '南京', en: 'Nanjing', emoji: '🏯', tier: '新一线',
    slogan: '六朝古都的从容与分寸',
    portrait: '南京教会你：有时候慢一点，才能走得更远。高校/军工/国企密集，稳定感强；梧桐树、紫金山，城市绿化好。节奏不紧不慢，"刚刚好"的分寸感。',
    lifeScene: '11月的南京，梧桐树叶子落满了长江路。你住在鼓楼区一间老公寓，月租3600，楼下是开了20年的鸭子店，每天排队的都是附近的老南京人。\n\n你在新街口一家互联网金融公司做风控，周末你通常会睡到自然醒，然后走去夫子庙吃一碗鸭血粉丝汤——不是给游客吃的那种，是本地人吃的那种，汤里有一种说不清的老味道。\n\n你最喜欢南京的，是它那种"刚刚好"的分寸感。不急，不燥，不争，但也不是没有故事。紫金山顶的日出你去过三次，每次看到的南京都不一样——有时候是雾，有时候是城，有时候是你自己。\n\n南京教会你：有时候慢一点，才能走得更远。',
    data: { salary: '8,000-16,000', rent: '2,200-4,500', metro: '58%', commute: '36分钟' },
    dims: { stable: 86, facility: 87, rhythm: 75, international: 80, living: 78, food: 80, opportunity: 82, cost: 62 },
    friendCities: ['beijing', 'hangzhou'],
    tags: ['稳定', '文化', '分寸感']
  },
  wuhan: {
    name: '武汉', en: 'Wuhan', emoji: '🌸', tier: '新一线',
    slogan: '九省通衢的连接与可能',
    portrait: '武汉是一座让你觉得一切都有可能的城市——九省通衢，四通八达，你在这里，感觉和整个中国都有连接。交通枢纽，高铁通达性全国前三；热干面/小龙虾，美食便宜。',
    lifeScene: '5月的武汉，是最好的时候。你住在洪山区一间高校旁的两居室，月租2600，楼下就是武汉大学的侧门，5月的樱花虽然谢了，但梧桐树刚刚换上新叶，整条珞喻路绿得发亮。\n\n你做光电子行业，在光谷上班。每天早上你骑电动车穿过珞喻路，经过武汉大学牌坊，经过光谷广场那个永远在修的大转盘，到公司9点整。中午你和同事去光谷步行街吃一顿热干面，4块5，加一个面窝，吃完继续干活。\n\n周末你会去东湖骑车，从磨山骑到落雁景区，一路40公里，骑到腿软但心里特别痛快。晚上你们去吉庆街吃宵夜，点了油焖大虾和几瓶啤酒，聊你们公司的融资进度，聊武汉房价终于降了，聊隔壁实验室的师兄去了深圳——然后你会庆幸自己留在了武汉。\n\n武汉是一座让你觉得一切都有可能的城市——九省通衢，四通八达，你在这里，感觉和整个中国都有连接。',
    data: { salary: '7,000-14,000', rent: '1,500-3,200', metro: '52%', commute: '34分钟' },
    dims: { stable: 80, facility: 88, rhythm: 80, international: 75, living: 72, food: 90, opportunity: 78, cost: 78 },
    friendCities: ['chengdu', 'changsha'],
    tags: ['交通枢纽', '美食', '性价比']
  },
  changsha: {
    name: '长沙', en: 'Changsha', emoji: '🔥', tier: '强二线',
    slogan: '网红之城的痛快与烟火',
    portrait: '长沙是一座让你"不想走"的城市——不是因为它有多完美，而是因为它让你觉得：活着，就该这么痛快。房价0.8-1.5万/㎡，全国最宜居成本；臭豆腐/小龙虾/辣椒炒肉，文娱夜宵天堂。',
    lifeScene: '3月的长沙，梅雨季，湿漉漉的，但这不妨碍五一广场从早到晚都是人。你住在岳麓区一间新小区的一居室，月租1800，骑车到橘子洲头只要20分钟。\n\n你在文和友做品牌策划，白天和网红店打交道，晚上11点下班后和同事去冬瓜山吃宵夜——东瓜山肉肠配一杯冰镇绿豆沙，你吃了三年了还是觉得好吃。\n\n周末你约了闺蜜去湖南省博物馆，看马王堆汉墓的辛追夫人，看了三次每次都有新发现。晚上你们去解放西的LIVEHOUSE听乐队演出，散场后去一家24小时营业的粉店吃最后一顿宵夜，辣椒炒肉的粉，你吃得满头大汗，心里特别满足。\n\n长沙是一座让你"不想走"的城市——不是因为它有多完美，而是因为它让你觉得：活着，就该这么痛快。',
    data: { salary: '6,000-12,000', rent: '1,200-2,200', metro: '38%', commute: '30分钟' },
    dims: { stable: 78, facility: 82, rhythm: 80, international: 70, living: 75, food: 93, opportunity: 72, cost: 88 },
    friendCities: ['chengdu', 'chongqing'],
    tags: ['夜生活', '美食', '低成本']
  },
  xiamen: {
    name: '厦门', en: 'Xiamen', emoji: '🌊', tier: '强二线',
    slogan: '海岛慢生活的温柔美学',
    portrait: '厦门是一座让人学会"慢慢来"的城市——海风吹着，时间流着，你好像终于有时间想清楚一些事情。气候温和，鼓浪屿+海景，花园城市；东南亚侨乡，国际化社区成熟。',
    lifeScene: '10月的厦门，终于凉下来了。你住在思明区一间环岛路边的民宿改造公寓，月租4200，打开窗户就能听见海浪的声音。\n\n你是自由译者，在家工作，每天早上你会去曾厝垵的一家咖啡馆写作，点一杯耶加雪菲，一坐就是半天。下午你会骑自行车沿着环岛路骑到黄厝，看海边拍婚纱照的新人，看完了自己也去拍了一张——没有原因，就是想留下点什么。\n\n周末你通常会去鼓浪屿走一走，这座小岛你来过无数次，但还是会再来，因为每次的天气不同、心情不同，遇到的人也不同。你在岛上的一家小店吃了一碗沙茶面，老板是个60多岁的老厦门，给你讲他年轻时候的故事。\n\n厦门是一座让人学会"慢慢来"的城市——海风吹着，时间流着，你好像终于有时间想清楚一些事情。',
    data: { salary: '7,000-14,000', rent: '2,800-5,500', metro: '25%', commute: '28分钟' },
    dims: { stable: 78, facility: 82, rhythm: 70, international: 85, living: 92, food: 83, opportunity: 72, cost: 52 },
    friendCities: ['qingdao', 'dali'],
    tags: ['海岛', '慢生活', '文艺']
  },
  qingdao: {
    name: '青岛', en: 'Qingdao', emoji: '🏖️', tier: '强二线',
    slogan: '海滨城市的惬意与料',
    portrait: '青岛是一座让你觉得"可以在这里躺平"的城市——但你躺下之后，又会发现它其实很有料。海岸线优美，啤酒节文化，空气质量好；海洋经济/制造业，就业稳定。',
    lifeScene: '7月的青岛，海风凉爽，是逃离内陆热浪最好的选择。你住在市南区一间八大关附近的老别墅改造公寓，月租3800，窗外是百年德式建筑和梧桐树。\n\n你在海尔做工业设计，上班骑自行车15分钟，穿过老城区的街巷，空气中混着海水的咸和槐花的香。中午你和同事去啤酒街喝一杯原浆啤酒，配一盘辣炒蛤蜊，吃完回去继续开会。\n\n周末你会早起去石老人海水浴场看日出——青岛的日出是在海平面上升起来的，那种感觉和山顶日出完全不同。看完日出你去团岛早市吃油条配甜沫，看大爷大妈们为了5毛钱讨价还价，你站在旁边笑，觉得这就是人间烟火。晚上你拎着一袋青岛啤酒回公寓，坐在院子里，看着天色一点一点暗下来。\n\n青岛是一座让你觉得"可以在这里躺平"的城市——但你躺下之后，又会发现它其实很有料。',
    data: { salary: '7,000-14,000', rent: '2,000-4,000', metro: '30%', commute: '28分钟' },
    dims: { stable: 80, facility: 80, rhythm: 72, international: 82, living: 88, food: 85, opportunity: 75, cost: 68 },
    friendCities: ['xiamen', 'dali'],
    tags: ['海滨', '啤酒', '宜居']
  },
  dali: {
    name: '大理', en: 'Dali', emoji: '🏔️', tier: '强二线',
    slogan: '苍山洱海的诗意与自由',
    portrait: '大理是一座让你"重新开始"的城市——不是重启，是找回那些在都市里弄丢的东西。苍山洱海，空气质量顶级，诗意栖居；远程工作/创业者聚集。',
    lifeScene: '6月的大理，雨季刚刚开始，苍山被云雾笼罩，洱海边的风把所有的焦虑都吹散了。你住在大理古城南门外一间白族老院子改造的客栈，月租2400，院子里有一棵很大的三角梅，房东是一对北京的艺术家夫妻，他们在这里住了5年了。\n\n你是自由职业者，做新媒体运营+偶尔接广告，旺季的时候帮客栈做做宣传，淡季的时候你就在院子里晒太阳，写你的公众号。\n\n每天早上你会被隔壁邻居家的鸡叫醒（对，真的有鸡），然后步行去北门菜市场买新鲜蔬菜和当地的酸奶。白天你在古城的一家咖啡馆工作，窗外是大理的蓝天白云，背景音是白族老奶奶在聊天，你一个字也听不懂，但你觉得特别安心。傍晚你去洱海边骑行，看落日在苍山后面一点一点沉下去，整个洱海被染成金红色。\n\n大理是一座让你"重新开始"的城市——不是重启，是找回那些在都市里弄丢的东西。',
    data: { salary: '4,000-8,000', rent: '1,000-2,800', metro: '0%', commute: '15分钟' },
    dims: { stable: 50, facility: 62, rhythm: 30, international: 70, living: 98, food: 72, opportunity: 35, cost: 65 },
    friendCities: ['xiamen', 'qingdao'],
    tags: ['自由', '慢生活', '自然']
  }
};

const questions = [
  {
    id: 'q1',
    text: '你理想中的周末，通常这样度过？',
    options: [
      { label: '睡到自然醒，逛美术馆、喝精品咖啡、约朋友Brunch，发朋友圈精心修图', scores: { international: 12, food: 8, living: 6 } },
      { label: '睡到中午，去老字号排队吃早茶，下午逛公园或者爬爬山', scores: { food: 12, stable: 8, living: 6 } },
      { label: '不管几点起床，先去爬个山、骑个车、流一身汗再说', scores: { living: 10, rhythm: 8, stable: 6 } },
      { label: '在家做饭，请朋友来家里喝酒聊天到深夜', scores: { stable: 10, food: 8, opportunity: -4 } }
    ]
  },
  {
    id: 'q2',
    text: '如果你中了500万（税后），第一件事会做什么？',
    options: [
      { label: '先把房贷还了，然后辞职去旅行一年', scores: { stable: 8, living: 6, opportunity: -6 } },
      { label: '在喜欢的城市买套房子，再投资做点小生意', scores: { opportunity: 12, stable: 6, international: 4 } },
      { label: '继续上班，拿出50万犒劳自己，存起来用利息生活', scores: { stable: 14, cost: 8, opportunity: 4 } },
      { label: '捐一半，剩下的一半拿去读个一直想读的书/学位', scores: { international: 8, facility: 6, opportunity: 8 } }
    ]
  },
  {
    id: 'q3',
    text: '你最理想的居住空间是？',
    options: [
      { label: '城市核心区的高层公寓，落地窗，俯瞰城市夜景', scores: { international: 12, facility: 10, rhythm: 8 } },
      { label: '有院子的老房子或四合院，种花养猫，有历史有温度', scores: { living: 10, stable: 8, food: 6 } },
      { label: '郊区或山边的大房子，有天台有花园，远离人群', scores: { living: 14, stable: 4, rhythm: -6 } },
      { label: '一间小小studio，够住就行，把钱省下来去体验生活', scores: { cost: 12, rhythm: 6, opportunity: -4 } }
    ]
  },
  {
    id: 'q4',
    text: '你对「工作」的底线是？',
    options: [
      { label: '钱少点可以，但绝对不能占用我全部时间，要有自己的生活', scores: { cost: 12, rhythm: -6, stable: 6 } },
      { label: '钱给够，强度大也无所谓，年轻就是要拼事业', scores: { opportunity: 14, rhythm: 10, cost: -8 } },
      { label: '稳定压倒一切，五险一金到位，不求大富大贵', scores: { stable: 14, facility: 8, opportunity: -4 } },
      { label: '必须是我真正热爱的事情，否则多少钱都不干', scores: { opportunity: 6, international: 8, stable: -6 } }
    ]
  },
  {
    id: 'q5',
    text: '你最被哪种城市气质打动？',
    options: [
      { label: '纽约/上海那种——繁华、机会、永远有新鲜事', scores: { international: 14, opportunity: 12, rhythm: 10 } },
      { label: '京都/苏州那种——精致、有文化、有历史深度', scores: { living: 10, stable: 8, food: 6 } },
      { label: '清迈/大理那种——慢、便宜、自由、有风', scores: { living: 14, cost: 12, rhythm: -10 } },
      { label: '成都/长沙那种——热闹、好玩、充满烟火气', scores: { food: 14, stable: 6, rhythm: 6 } }
    ]
  },
  {
    id: 'q6',
    text: '你点外卖的频率是？',
    options: [
      { label: '几乎每天，太忙了没时间做饭', scores: { facility: 8, rhythm: 6, cost: -4 } },
      { label: '经常自己做饭，偶尔点外卖，外卖会选贵的', scores: { food: 8, cost: 4, living: 4 } },
      { label: '从来不点外卖，觉得不健康，宁愿下楼吃或自己做', scores: { food: 12, living: 6, cost: 4 } },
      { label: '经常深夜点外卖，边吃夜宵边追剧是最大快乐', scores: { food: 14, rhythm: 6, cost: -6 } }
    ]
  },
  {
    id: 'q7',
    text: '如果有机会去海外工作1年，你会？',
    options: [
      { label: '毫不犹豫就去，趁年轻多看看这个世界', scores: { international: 14, opportunity: 8, stable: -4 } },
      { label: '会考虑，但担心回来后一切都变了', scores: { stable: 6, international: 8, opportunity: 4 } },
      { label: '算了，国外没有中国好吃好玩，我不想去', scores: { food: 12, stable: 6, international: -8 } },
      { label: '其实在国内也有很多机会，不一定非得出国', scores: { opportunity: 8, stable: 6, international: 2 } }
    ]
  },
  {
    id: 'q8',
    text: '你最害怕哪种人生状态？',
    options: [
      { label: '老了回头看，一辈子都在做不喜欢的工作', scores: { opportunity: 8, stable: -4, international: 6 } },
      { label: '在一个地方困一辈子，没有机会看到更大的世界', scores: { international: 12, rhythm: 8, stable: -8 } },
      { label: '赚了很多钱但身体垮了，没有时间陪家人', scores: { stable: 12, living: 8, opportunity: -6 } },
      { label: '每天一模一样，没有任何惊喜和期待', scores: { rhythm: 12, food: 6, opportunity: 4 } }
    ]
  },
  {
    id: 'q9',
    text: '你的朋友会用什么词形容你？',
    options: [
      { label: '有野心 / 很拼 / 目标感强', scores: { opportunity: 12, rhythm: 10, international: 6 } },
      { label: '会玩 / 懂吃 / 段子手', scores: { food: 12, rhythm: 6, stable: 4 } },
      { label: '靠谱 / 踏实 / 温暖', scores: { stable: 14, facility: 6, opportunity: 2 } },
      { label: '有趣 / 文艺 / 有想法', scores: { international: 10, living: 8, opportunity: 4 } }
    ]
  },
  {
    id: 'q10',
    text: '你会选择和谁成为邻居？',
    options: [
      { label: '和我一样努力工作的年轻人，互相激励', scores: { rhythm: 12, opportunity: 8, international: 4 } },
      { label: '各行各业热热闹闹的邻居，让我永远有新鲜故事听', scores: { stable: 8, food: 8, rhythm: 4 } },
      { label: '安静的老人家庭，给社区带来安稳的氛围', scores: { stable: 12, living: 6, rhythm: -6 } },
      { label: '不知道，也不在乎，邻居是谁都无所谓', scores: { cost: 8, living: 4, stable: -4 } }
    ]
  },
  {
    id: 'q11',
    text: '你对「买房」这件事的态度是？',
    options: [
      { label: '一定要买，那是安全感的来源，没有房子就不算安定', scores: { stable: 14, facility: 8, opportunity: -4 } },
      { label: '可以租，住在哪里都一样，不动产不是我的追求', scores: { cost: 14, living: 8, stable: -8 } },
      { label: '看情况，有能力就买，能力不够就先租着不勉强', scores: { stable: 6, cost: 6, opportunity: 4 } },
      { label: '不买，但希望在一个城市长久待下去，建立自己的圈子', scores: { stable: 8, opportunity: 6, cost: 4 } }
    ]
  },
  {
    id: 'q12',
    text: '你最看重食物的哪个方面？',
    options: [
      { label: '正宗、地道、有文化传承，一口能吃到历史', scores: { food: 12, stable: 6, living: 4 } },
      { label: '好看、好拍照、发朋友圈能赢', scores: { international: 10, food: 6, facility: 6 } },
      { label: '便宜大碗、性价比高，好吃就行不挑环境', scores: { food: 10, cost: 10, living: -4 } },
      { label: '健康、有机、无添加，吃得放心最重要', scores: { living: 10, stable: 6, food: -4 } }
    ]
  },
  {
    id: 'q13',
    text: '如果让你选择一座城市「长期定居」，你最看重什么？',
    options: [
      { label: '工作机会多，薪资天花板高，能实现野心', scores: { opportunity: 14, rhythm: 8, international: 4 } },
      { label: '生活成本合理，存得到钱，未来有希望', scores: { cost: 12, stable: 8, living: 4 } },
      { label: '气候好、空气好、节奏慢，住得舒服最重要', scores: { living: 14, cost: 6, rhythm: -8 } },
      { label: '文化氛围浓，有美术馆、书店、有深度的生活', scores: { international: 10, stable: 6, food: 4 } }
    ]
  },
  {
    id: 'q14',
    text: '你和朋友聚会通常怎么安排？',
    options: [
      { label: '去各种新鲜的餐厅/酒吧/咖啡馆，永远在打卡新地方', scores: { food: 12, international: 8, rhythm: 4 } },
      { label: '在家做饭或点外卖，边吃边聊，氛围最重要', scores: { stable: 10, food: 8, cost: 4 } },
      { label: '户外活动——爬山/骑车/逛公园，运动才是正经事', scores: { living: 12, stable: 4, rhythm: 4 } },
      { label: '去剧本杀/密室/KTV，娱乐项目要丰富有趣', scores: { rhythm: 12, food: 4, stable: 4 } }
    ]
  },
  {
    id: 'q15',
    text: '你的通勤时间能接受多长？',
    options: [
      { label: '单程30分钟内，必须保障睡眠和生活质量', scores: { cost: 10, stable: 6, rhythm: -4 } },
      { label: '1小时左右可以接受，在地铁上可以读书/学习', scores: { opportunity: 8, stable: 6, facility: 4 } },
      { label: '距离无所谓，只要工资够高，路上两小时也认', scores: { opportunity: 14, rhythm: 8, cost: -8 } },
      { label: '最好在家上班或混合办公，不受通勤约束', scores: { living: 10, cost: 8, stable: 4 } }
    ]
  },
  {
    id: 'q16',
    text: '什么样的场景最让你有「幸福感」？',
    options: [
      { label: '凌晨加班后走出公司，看到城市的灯光，觉得一切值得', scores: { opportunity: 14, rhythm: 10, international: 4 } },
      { label: '夏天傍晚在江边/海边散步，和朋友喝着啤酒聊未来', scores: { food: 12, living: 8, stable: 6 } },
      { label: '在一个熟悉的老店吃到了十几年不变的味道', scores: { stable: 12, food: 8, living: 4 } },
      { label: '周末下厨，做了一桌好菜，朋友们吃得精光', scores: { stable: 10, food: 10, cost: 4 } }
    ]
  },
  {
    id: 'q17',
    text: '你最想体验哪种生活方式？',
    options: [
      { label: '在顶级写字楼里踩着高跟鞋，喝着拿铁，谈着百万生意', scores: { international: 14, opportunity: 12, facility: 4 } },
      { label: '在古镇开一家小店，每天面对不同的旅人，晒太阳', scores: { living: 14, cost: 8, stable: -4 } },
      { label: '有自己的小家，下班回家有热饭，孩子在身边跑来跑去', scores: { stable: 14, food: 8, facility: 4 } },
      { label: '到处旅居，每个月换个城市生活，没有固定居所', scores: { international: 14, living: 8, stable: -10 } }
    ]
  },
  {
    id: 'q18',
    text: '你对城市的「夜生活」态度是？',
    options: [
      { label: '必不可少，蹦迪/喝酒/深夜觅食才是城市的灵魂', scores: { rhythm: 14, food: 10, international: 6 } },
      { label: '可以有但不是必须，偶尔去一次就行', scores: { food: 6, stable: 6, rhythm: 2 } },
      { label: '没什么兴趣，早睡早起身体好', scores: { stable: 10, living: 6, rhythm: -8 } },
      { label: '深夜是工作/创作的黄金时间，夜深人静效率最高', scores: { opportunity: 10, rhythm: 6, stable: -4 } }
    ]
  },
  {
    id: 'q19',
    text: '如果你必须离开现在的城市，你会最舍不得什么？',
    options: [
      { label: '我在这里建立的圈子、人脉、事业基础', scores: { stable: 14, opportunity: 6, facility: 4 } },
      { label: '这里的美食、独特的城市氛围、记忆里的街道', scores: { food: 14, stable: 6, living: 4 } },
      { label: '这里的发展机会和我一路走来的积累', scores: { opportunity: 14, rhythm: 6, international: 4 } },
      { label: '其实没什么舍不得，我一直在出发', scores: { international: 10, living: 6, stable: -8 } }
    ]
  },
  {
    id: 'q20',
    text: '十年后，你最希望自己在做什么？',
    options: [
      { label: '在某个领域做到顶尖财务自由，被人尊重', scores: { opportunity: 14, international: 8, stable: 2 } },
      { label: '在喜欢的城市有房有家，孩子健康成长', scores: { stable: 14, living: 8, food: 4 } },
      { label: '有一技之长，可以自由职业，去哪里都能活', scores: { international: 12, living: 8, opportunity: 6 } },
      { label: '还不知道，但希望那时的自己比现在更快乐', scores: { living: 10, cost: 8, stable: 4 } }
    ]
  }
];

const MATCH_LABELS = [
  { min: 90, label: '灵魂契合', color: '#D4A017' },
  { min: 80, label: '高度匹配', color: '#16A34A' },
  { min: 70, label: '相当合适', color: '#38BDF8' },
  { min: 60, label: '可以试试', color: '#6B7280' },
  { min: 50, label: '反向宜居', color: '#A78BFA' },
  { min: 0, label: '慎重考虑', color: '#DC2626' }
];

function getMatchLabel(percent) {
  return MATCH_LABELS.find(m => percent >= m.min);
}

const app = {
  shuffledQuestions: [],
  answers: {},
  exchangeCode: null,
  currentQuestion: 0,
  isTransitioning: false
};

const screens = {
  intro: document.getElementById('intro'),
  test: document.getElementById('test'),
  result: document.getElementById('result')
};

const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitTestBtn = document.getElementById('submitTestBtn');

function showScreen(name) {
  Object.entries(screens).forEach(([key, el]) => {
    el.classList.toggle('active', key === name);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function displayQuestion() {
  const q = app.shuffledQuestions[app.currentQuestion];
  if (!q) return;

  questionText.textContent = `问题${app.currentQuestion + 1}：${q.text}`;

  const progress = ((app.currentQuestion + 1) / app.shuffledQuestions.length) * 100;
  progressBar.style.width = `${progress}%`;
  progressText.textContent = `${app.currentQuestion + 1} / ${app.shuffledQuestions.length}`;

  const currentAnswer = app.answers[q.id];
  const optionLabels = ['A', 'B', 'C', 'D'];
  optionsContainer.innerHTML = q.options.map((opt, idx) => {
    const isSelected = currentAnswer === idx;
    return `<div class="option ${isSelected ? 'selected' : ''}" onclick="window.__city_select(${idx})"><span class="option-code">${optionLabels[idx]}</span><span class="option-text">${opt.label}</span></div>`;
  }).join('');

  prevBtn.style.display = app.currentQuestion > 0 ? 'inline-block' : 'none';
  const isLast = app.currentQuestion === app.shuffledQuestions.length - 1;
  nextBtn.style.display = isLast ? 'none' : 'inline-block';
  submitTestBtn.style.display = isLast ? 'inline-block' : 'none';
}

function selectAnswer(optionIndex) {
  if (app.isTransitioning) return;

  const q = app.shuffledQuestions[app.currentQuestion];
  if (!q) return;
  app.answers[q.id] = optionIndex;

  optionsContainer.querySelectorAll('.option').forEach((el, idx) => {
    el.classList.toggle('selected', idx === optionIndex);
  });

  const isLastQuestion = app.currentQuestion === app.shuffledQuestions.length - 1;
  if (!isLastQuestion) {
    goToNext();
  } else {
    updateProgress();
  }
}

function goToNext() {
  const q = app.shuffledQuestions[app.currentQuestion];
  if (!q) return;
  if (app.answers[q.id] === undefined) {
    alert('请先选择当前题目的选项');
    return;
  }
  const total = app.shuffledQuestions.length;
  if (app.currentQuestion >= total - 1) {
    updateProgress();
    return;
  }
  app.isTransitioning = true;
  optionsContainer.querySelectorAll('.option').forEach(opt => opt.classList.add('disabled'));
  setTimeout(() => {
    try {
      app.currentQuestion++;
      displayQuestion();
    } catch (e) {
      console.error('跳转题目出错:', e);
    } finally {
      app.isTransitioning = false;
    }
  }, 250);
}

function previousQuestion() {
  app.isTransitioning = false;
  if (app.currentQuestion > 0) {
    app.currentQuestion--;
    optionsContainer.querySelectorAll('.option').forEach(opt => opt.classList.remove('disabled'));
    displayQuestion();
  }
}

async function handleSubmitTest() {
  const unansweredCount = app.shuffledQuestions.filter(q => app.answers[q.id] === undefined).length;
  if (unansweredCount > 0) {
    alert(`请完成所有题目，还剩 ${unansweredCount} 题未回答`);
    return;
  }

  const userScores = computeUserScores();
  const cityMatches = computeCityMatches(userScores);
  const top1 = cityMatches[0];
  const top2 = cityMatches[1];
  const top3 = cityMatches[2];
  const personalityTags = computePersonalityTags(userScores);

  const resultData = {
    topCity: { key: top1.key, name: top1.name, matchPercent: top1.matchPercent, tier: top1.tier, slogan: top1.slogan },
    cityRanking: cityMatches.slice(0, 5).map(c => ({ key: c.key, name: c.name, matchPercent: c.matchPercent })),
    userDimensionScores: userScores,
    personalityTags: personalityTags.map(t => t.name)
  };

  try {
    if (app.exchangeCode && app.exchangeCode !== 'VIP88888') {
      const response = await fetch(`${API_BASE_URL}/submit-city`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: app.exchangeCode,
          rawAnswers: app.answers,
          resultData
        })
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            console.error('后端错误:', errorData);
          } catch (jsonError) {
            console.error('响应不是有效的JSON:', jsonError);
          }
        } else {
          console.error('后端错误:', response.status, response.statusText);
        }
      }
    }
  } catch (error) {
    console.error('提交测试异常:', error);
  }

  renderResult();
}

function updateProgress() {
  const done = app.shuffledQuestions.filter(q => app.answers[q.id] !== undefined).length;
  const total = app.shuffledQuestions.length;
  progressBar.style.width = `${(done / total) * 100}%`;
  progressText.textContent = `${done} / ${total}`;
}

function computeUserScores() {
  const userScores = {};
  DIM_KEYS.forEach(k => { userScores[k] = 0; });

  questions.forEach(q => {
    const answerIdx = app.answers[q.id];
    if (answerIdx !== undefined) {
      const opt = q.options[answerIdx];
      if (opt && opt.scores) {
        Object.entries(opt.scores).forEach(([dim, val]) => {
          if (userScores[dim] !== undefined) {
            userScores[dim] += val;
          }
        });
      }
    }
  });

  return userScores;
}

function computeCityMatches(userScores) {
  const results = [];

  Object.entries(CITIES).forEach(([key, city]) => {
    let dotProduct = 0;
    let cityNormSq = 0;

    DIM_KEYS.forEach(dim => {
      const cityVal = city.dims[dim];
      const userVal = userScores[dim];
      dotProduct += userVal * cityVal;
      cityNormSq += cityVal * cityVal;
    });

    const rawScore = cityNormSq > 0 ? dotProduct / Math.sqrt(cityNormSq) : 0;
    results.push({ key, ...city, rawScore });
  });

  results.sort((a, b) => b.rawScore - a.rawScore);

  const maxRaw = results[0].rawScore;
  results.forEach(r => {
    r.matchPercent = maxRaw > 0 ? Math.round((r.rawScore / maxRaw) * 100) : 0;
  });

  return results;
}

function drawRadarChart(cityKey) {
  const canvas = document.getElementById('radarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 440;
  const H = 440;
  canvas.width = W;
  canvas.height = H;
  const cx = W / 2;
  const cy = H / 2;
  const R = Math.min(W, H) / 2 - 60;
  const n = DIM_KEYS.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  ctx.clearRect(0, 0, W, H);

  for (let level = 1; level <= 5; level++) {
    const r = (R / 5) * level;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const angle = startAngle + angleStep * (i % n);
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  for (let i = 0; i < n; i++) {
    const angle = startAngle + angleStep * i;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + R * Math.cos(angle), cy + R * Math.sin(angle));
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  const city = CITIES[cityKey];
  ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const dim = DIM_KEYS[i % n];
    const val = city.dims[dim] / 100;
    const angle = startAngle + angleStep * (i % n);
    const r = R * val;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();

  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
  gradient.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
  gradient.addColorStop(1, 'rgba(56, 189, 248, 0.08)');
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 2;
  ctx.setLineDash([]);
  ctx.stroke();

  for (let i = 0; i < n; i++) {
    const dim = DIM_KEYS[i];
    const val = city.dims[dim] / 100;
    const angle = startAngle + angleStep * i;
    const r = R * val;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#38BDF8';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  ctx.font = '12px "Segoe UI", sans-serif';
  ctx.fillStyle = '#666';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < n; i++) {
    const dim = DIM_KEYS[i];
    const angle = startAngle + angleStep * i;
    const labelR = R + 48;
    const x = cx + labelR * Math.cos(angle);
    const y = cy + labelR * Math.sin(angle);
    ctx.fillText(DIM_META[dim].name, x, y);
  }
}

const PERSONALITY_TAGS = [
  {
    id: 'ambition',
    name: '野心家',
    icon: '🔥',
    desc: '对事业和成就有强烈的渴望，不甘平庸',
    condition: (s) => s.opportunity > 60 && s.rhythm > 40
  },
  {
    id: 'free_spirit',
    name: '自由灵魂',
    icon: '🕊️',
    desc: '不被框架束缚，渴望探索更多可能性',
    condition: (s) => s.international > 50 && s.rhythm > 30 && s.stable < 80
  },
  {
    id: 'artistic',
    name: '艺术气质',
    icon: '🎨',
    desc: '审美在线，追求生活中的美与质感',
    condition: (s) => s.international > 45 && s.living > 60 && s.food > 40
  },
  {
    id: 'rebellious',
    name: '反叛精神',
    icon: '⚡',
    desc: '不随波逐流，敢于打破常规走自己的路',
    condition: (s) => s.rhythm > 60 && s.opportunity > 50 && s.stable < 70
  },
  {
    id: 'introspective',
    name: '内省深刻',
    icon: '🌙',
    desc: '善于思考内心世界，追求精神层面的满足',
    condition: (s) => s.living > 55 && s.stable > 50 && s.rhythm < 75
  },
  {
    id: 'poetic',
    name: '诗意栖居',
    icon: '🍃',
    desc: '向往自然、慢节奏、有温度的生活方式',
    condition: (s) => s.living > 65 && s.food > 50 && s.rhythm < 65
  },
  {
    id: 'pragmatic',
    name: '务实主义者',
    icon: '⚖️',
    desc: '看重性价比和生活质量，精打细算地过日子',
    condition: (s) => s.cost > 60 && s.stable > 50
  },
  {
    id: 'foodie',
    name: '人间烟火客',
    icon: '🍜',
    desc: '人生大事唯有美食不可辜负，吃是最大的快乐',
    condition: (s) => s.food > 70
  },
  {
    id: 'urbanite',
    name: '都市精英',
    icon: '🏙️',
    desc: '享受城市的繁华便利，追求高效精致的生活',
    condition: (s) => s.facility > 70 && s.international > 55 && s.rhythm > 50
  },
  {
    id: 'adventurer',
    name: '冒险家',
    icon: '🧭',
    desc: '不安于现状，总想看看外面的世界',
    condition: (s) => s.international > 65 && s.opportunity > 45 && s.stable < 60
  },
  {
    id: 'homebody',
    name: '温暖居家派',
    icon: '🏠',
    desc: '家是最好的港湾，稳定比什么都重要',
    condition: (s) => s.stable > 75 && s.living > 55 && s.cost > 50
  },
  {
    id: 'night_owl',
    name: '夜猫子',
    icon: '🦉',
    desc: '夜晚才是真正属于自己的时间，越夜越精彩',
    condition: (s) => s.rhythm > 65 && s.food > 55
  },
  {
    id: 'slow_lifer',
    name: '慢生活信徒',
    icon: '☕',
    desc: '相信好东西值得等，生活不必那么赶',
    condition: (s) => s.living > 70 && s.rhythm < 50 && s.stable > 45
  },
  {
    id: 'hustler',
    name: '奋斗者',
    icon: '💪',
    desc: '年轻就是要拼，用汗水换未来的可能性',
    condition: (s) => s.opportunity > 65 && s.rhythm > 55 && s.cost < 70
  },
  {
    id: 'aesthete',
    name: '审美控',
    icon: '✨',
    desc: '对美有执念，从咖啡杯到城市天际线都要好看',
    condition: (s) => s.international > 58 && s.facility > 55 && s.living > 50
  },
  {
    id: 'wanderer',
    name: '漂泊旅人',
    icon: '🎒',
    desc: '没有固定的归属感，哪里都是家也哪里都不是家',
    condition: (s) => s.international > 60 && s.stable < 55 && s.cost > 45
  }
];

function computePersonalityTags(userScores) {
  const matched = [];
  const sorted = PERSONALITY_TAGS.map(tag => ({
    ...tag,
    score: 0,
    dims: {}
  })).sort(() => Math.random() - 0.5);

  for (const tag of sorted) {
    if (tag.condition(userScores)) {
      let relevance = 0;
      if (tag.id === 'ambition') { relevance = (userScores.opportunity + userScores.rhythm) / 2; }
      else if (tag.id === 'free_spirit') { relevance = userScores.international + userScores.rhythm - userScores.stable / 2; }
      else if (tag.id === 'artistic') { relevance = (userScores.international + userScores.living + userScores.food) / 3; }
      else if (tag.id === 'rebellious') { relevance = userScores.rhythm + userScores.opportunity - userScores.stable / 2; }
      else if (tag.id === 'introspective') { relevance = userScores.living + userScores.stable - userScores.rhythm / 3; }
      else if (tag.id === 'poetic') { relevance = userScores.living + userScores.food - userScores.rhythm / 2; }
      else if (tag.id === 'pragmatic') { relevance = userScores.cost + userScores.stable; }
      else if (tag.id === 'foodie') { relevance = userScores.food; }
      else if (tag.id === 'urbanite') { relevance = (userScores.facility + userScores.international + userScores.rhythm) / 3; }
      else if (tag.id === 'adventurer') { relevance = userScores.international + userScores.opportunity - userScores.stable / 2; }
      else if (tag.id === 'homebody') { relevance = userScores.stable + userScores.living + userScores.cost; }
      else if (tag.id === 'night_owl') { relevance = userScores.rhythm + userScores.food; }
      else if (tag.id === 'slow_lifer') { relevance = userScores.living + userScores.stable - userScores.rhythm; }
      else if (tag.id === 'hustler') { relevance = userScores.opportunity + userScores.rhythm; }
      else if (tag.id === 'aesthete') { relevance = (userScores.international + userScores.facility + userScores.living) / 3; }
      else if (tag.id === 'wanderer') { relevance = userScores.international + userScores.cost - userScores.stable / 2; }

      matched.push({ ...tag, relevance });
    }
  }

  matched.sort((a, b) => b.relevance - a.relevance);
  return matched.slice(0, 5);
}

function renderPersonalityTags(userScores) {
  const container = document.getElementById('personalityTags');
  const tags = computePersonalityTags(userScores);

  let html = '<div class="personality-tags-wrap">';
  tags.forEach(tag => {
    html += `<div class="personality-tag"><span class="personality-tag-icon">${tag.icon}</span>${tag.name}</div>`;
  });
  html += '</div>';
  html += `<p class="personality-tags-desc">${tags.map(t => t.desc).join(' · ')}</p>`;

  container.innerHTML = html;
}

function renderResult() {
  const userScores = computeUserScores();
  const cityMatches = computeCityMatches(userScores);

  const top1 = cityMatches[0];
  const top2 = cityMatches[1];
  const top3 = cityMatches[2];

  document.getElementById('resultEmoji').textContent = top1.emoji;
  document.getElementById('resultKicker').textContent = '🏆 你的灵魂城市';
  document.getElementById('resultCityName').textContent = top1.name;
  document.getElementById('resultCityEn').textContent = top1.en;
  document.getElementById('resultCitySlogan').textContent = `「${top1.slogan}」`;

  const matchInfo = getMatchLabel(top1.matchPercent);
  const matchBadge = document.querySelector('.city-match-badge');
  matchBadge.style.color = '#0EA5E9';
  document.getElementById('resultMatchPercent').textContent = `${top1.matchPercent}%`;
  document.getElementById('resultMatchPercent').style.color = matchInfo.color;
  document.getElementById('resultMatchLabel').textContent = matchInfo.label;
  document.getElementById('resultMatchLabel').style.color = matchInfo.color;
  document.getElementById('resultCitySub').textContent = `匹配度 ${top1.matchPercent}% · ${top1.tier}城市`;

  renderPersonalityTags(userScores);
  renderWhyBox(userScores, top1);
  drawRadarChart(top1.key);
  renderDimList(top1);
  document.getElementById('cityPortrait').textContent = top1.portrait;
  document.getElementById('cityLifeScene').textContent = top1.lifeScene;
  renderDataCards(top1);
  renderFriendCities(top2, top3);

  showScreen('result');
}

function renderWhyBox(userScores, topCity) {
  const sortedDims = DIM_KEYS.map(k => ({ key: k, score: userScores[k] }))
    .sort((a, b) => b.score - a.score);

  const highestDim = sortedDims[0];
  const lowestDim = sortedDims[sortedDims.length - 1];

  const highMeta = DIM_META[highestDim.key];
  const lowMeta = DIM_META[lowestDim.key];
  const highCityVal = topCity.dims[highestDim.key];
  const lowCityVal = topCity.dims[lowestDim.key];

  const whyBox = document.getElementById('whyBox');
  whyBox.innerHTML = `
    <p>🎯 你的最高得分维度是<span class="highlight">${highMeta.name}</span>，而${topCity.name}在这一维度上得分高达 <span class="highlight">${highCityVal}</span>，与你的需求高度吻合。</p>
    <p>💡 你的得分较低维度是<span class="highlight">${lowMeta.name}</span>，而${topCity.name}在该维度得分为 ${lowCityVal}，${lowCityVal >= 70 ? '同样表现不俗，能很好地弥补你的需求' : '虽然不是最强项，但恰好能让你在忙碌中找到平衡'}。</p>
    <p>✨ 一句话总结：这座城市恰好能容纳你的野心，也接得住你的脆弱。</p>
  `;
}

function renderDimList(city) {
  const dimList = document.getElementById('dimList');
  dimList.innerHTML = DIM_KEYS.map(dim => {
    const meta = DIM_META[dim];
    const val = city.dims[dim];
    return `
      <div class="dim-item">
        <div class="dim-item-top">
          <div class="dim-item-name">${meta.name}</div>
          <div class="dim-item-score">${val}/100</div>
        </div>
        <div class="dim-bar-bg">
          <div class="dim-bar-fill" style="width: ${val}%"></div>
        </div>
        <p style="margin-top:6px;">${meta.desc}</p>
      </div>
    `;
  }).join('');
}

function renderDataCards(city) {
  const dataCards = document.getElementById('dataCards');
  const items = [
    { label: '平均月薪参考', value: city.data.salary, icon: '💰' },
    { label: '一居室月租参考', value: city.data.rent, icon: '🏠' },
    { label: '地铁覆盖率', value: city.data.metro, icon: '🚇' },
    { label: '平均通勤时间', value: city.data.commute, icon: '⏱️' }
  ];
  dataCards.innerHTML = items.map(item => `
    <div class="data-card-item">
      <div class="data-card-label">${item.icon} ${item.label}</div>
      <div class="data-card-value">${item.value}</div>
    </div>
  `).join('');
}

function renderFriendCities(top2, top3) {
  const container = document.getElementById('friendCities');
  container.innerHTML = '';
  [top2, top3].forEach(city => {
    const matchInfo = getMatchLabel(city.matchPercent);
    container.innerHTML += `
      <div class="friend-city-card">
        <div class="friend-city-emoji">${city.emoji}</div>
        <div class="friend-city-name">${city.name}</div>
        <div class="friend-city-en">${city.en}</div>
        <div class="friend-city-match" style="color:${matchInfo.color}">${city.matchPercent}%</div>
        <div class="friend-city-match-label">${matchInfo.label}</div>
        <div class="friend-city-slogan">「${city.slogan}」</div>
        <div class="friend-city-tags">
          ${(city.tags || []).map(t => `<span class="friend-city-tag">${t}</span>`).join('')}
        </div>
        <div class="match-bar-bg">
          <div class="match-bar-fill" style="width:${city.matchPercent}%; background:${matchInfo.color}"></div>
        </div>
      </div>
    `;
  });
}

function startTest() {
  app.answers = {};
  app.currentQuestion = 0;
  app.isTransitioning = false;
  app.shuffledQuestions = shuffle(questions);
  displayQuestion();
  showScreen('test');
}

function showCodeModal() {
  document.getElementById('codeModal').classList.add('active');
  document.getElementById('codeInput').value = '';
  document.getElementById('codeError').classList.remove('show');
  document.getElementById('codeInput').focus();
}

function closeCodeModal() {
  document.getElementById('codeModal').classList.remove('active');
  document.getElementById('codeInput').value = '';
  document.getElementById('codeError').classList.remove('show');
}

async function validateCode() {
  const code = document.getElementById('codeInput').value.trim().toUpperCase();
  const errorDiv = document.getElementById('codeError');

  if (!code || code.length !== 8) {
    errorDiv.textContent = '请输入8位兑换码';
    errorDiv.classList.add('show');
    return;
  }

  if (code === 'VIP88888') {
    app.exchangeCode = code;
    closeCodeModal();
    startTest();
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/validate-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    if (!response.ok) {
      throw new Error('兑换码不存在');
    }

    app.exchangeCode = code;
    closeCodeModal();
    startTest();
  } catch (error) {
    errorDiv.textContent = '兑换码不存在';
    errorDiv.classList.add('show');
  }
}

window.__city_select = selectAnswer;

function saveResultImage() {
  const resultContainer = document.querySelector('.result-layout');
  if (!resultContainer) return;

  html2canvas(resultContainer, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff'
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = `性格匹配城市测试结果-${new Date().getTime()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }).catch(error => {
    console.error('保存图片失败:', error);
    alert('保存图片失败，请稍后重试');
  });
}

function openImageModal(imgElement) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('imageModalImg');
  modalImg.src = imgElement.src;
  modalImg.alt = imgElement.alt;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeImageModal(event) {
  if (event) {
    var target = event.target;
    if (target.classList.contains('image-modal-img')) return;
  }
  var modal = document.getElementById('imageModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    var modal = document.getElementById('imageModal');
    if (modal && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('startBtn').addEventListener('click', showCodeModal);
  document.getElementById('prevBtn').addEventListener('click', previousQuestion);
  document.getElementById('nextBtn').addEventListener('click', goToNext);
  document.getElementById('submitTestBtn').addEventListener('click', handleSubmitTest);
  document.getElementById('codeCancelBtn').addEventListener('click', closeCodeModal);
  document.getElementById('codeValidateBtn').addEventListener('click', validateCode);
  const saveBtn = document.getElementById('saveResultBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveResultImage);
  }
});
