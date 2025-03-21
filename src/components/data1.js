export default [
    {
        name: "data0",
        type: "Origin",
        id:'01',
        level:0,
        fields: [
            {name: "aaa",id:'011'}, 
            {name: "bbb",id:'012'},
            {name: "ccc",id:'013'}
        ],
    },
    {
        name: "data1",
        type: "Origin",
        evel:0,
        id:'02',
        fields: [
            {name: "age",id:'021'}, 
            {name: "name",id:'022'},
            {name: "class",id:'023'}
        ],
    },
    {
        name: "data2",
        type: "Origin",
        evel:0, 
        id:'03',
        fields: [
            {name: "age",id:'031'}, 
            {name: "name",id:'032'},
            {name: "grade",id:'033'}
        ],
    },
    {
        name: "data3",
        type: "Origin",
        evel:0, 
        id:'04',
        fields: [
            {name: "age",id:'041'}, 
            {name: "name",id:'042'},
            {name: "grade",id:'043'}
        ],
    },
    {
        name: "middle1",
        type: "Middle",
        evel:1, 
        id:'11',
        fields: [
            {name: "age1",id:'111',parentId:['021']}, 
            {name: "name",id:'112',parentId:['042']},
            {name: "grade",id:'113'}
        ],
    },
    {
        name: "middle2",
        type: "Middle",
        evel:1, 
        id:'12',
        fields: [
            {name: "age1",id:'121',parentId:['021','031']}, 
            {name: "name",id:'122',parentId:['012','032']},
            {name: "class",id:'123',parentId:[]},
            {name: "grade",id:'124',parentId:['033']}
        ],
    },
    {
        name: "form1",
        type: "Union",
        evel:2, 
        id:'21',
        fields: [
            {name: "age3",id:'211',parentId:['211']}, 
            {name: "name",id:'212',parentId:['222']},
            {name: "class",id:'213',parentId:['223']},
            {name: "grade",id:'214',parentId:['224']}
        ],
    },
    {
        name: "form2",
        type: "Union",
        evel:2, 
        id:'22',
        fields: [
            {name: "aaa",id:'221',parentId:['211']}, 
            {name: "bbb",id:'222',parentId:['212']},
            {name: "ccc",id:'223',parentId:['221']},
            {name: "ddd",id:'224'}
        ],
    },
    {
        name: "RS",
        type: "RS",
        evel:3, 
        id:'31',
        fields: [
            {name: "age4",id:'311',parentId:['311']}, 
            {name: "name",id:'312',parentId:['312']},
            {name: "class",id:'313',parentId:['313']},
            {name: "grade",id:'314',parentId:['314']}
        ],
    },
]
