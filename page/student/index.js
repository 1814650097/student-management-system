const creator='老张'
function getBooksList() {
    axios({
        url:'http://hmajax.itheima.net/api/books',
        params: {
            creator
        }
    }).then(result=>{
        // 获取数据
        const bookslist=result.data.data
        
        // 渲染    
        const book_str=bookslist.map((item,index)=>{
        const {id,bookname,author,publisher}=item
        return `
        <tr>
            <td>${index+1}</td>
            <td>${bookname}</td>
            <td>${author}</td>
            <td>${publisher}</td>
            
            <td data-id=${item.id}>
                <span class="del">删除</span>
                <span class="edit">编辑</span>
            </td>
        </tr>
        `
    }).join('')
        document.querySelector('.list').innerHTML=book_str
    })
}
getBooksList()

// 创建弹框对象
const addModalDom=document.querySelector('.add-modal')
const addModal=new bootstrap.Modal(addModalDom)

// 添加
document.querySelector('.add-btn').addEventListener('click',()=>{
    // 收集数据
    const addForm =document.querySelector('.add-form')
    const bookobj =serialize(addForm,{hash:true,empty:true})

    // 提交服务器保存
    axios({
        url:'http://hmajax.itheima.net/api/books',
        method:'POST',
        data:{
            ...bookobj,
            creator
        }
    }).then(result=>{
        console.log(result);
        //重新渲染
        getBooksList()
        // 重置表单
        addForm.reset()
        // 隐藏弹框
        addModal.hide()

    })
})

// 删除

// 事件委托绑定父元素(因为是动态的)
document.querySelector('.list').addEventListener('click',e=>{
    // 判断是否点击的是删除元素
    if(e.target.classList.contains('del')) {
        // 获取id
        const theId = e.target.parentNode.dataset.id
        // 将对应id的信息从服务器中删除
        axios({
            url:`http://hmajax.itheima.net/api/books/${theId}`,
            method:'DELETE'
        }).then(()=>{
            // 从新渲染
            getBooksList()
        })
    }
})

// 编辑
const editDOM=document.querySelector('.edit-modal')
const editModal=new bootstrap.Modal(editDOM)

document.querySelector('.list').addEventListener('click',e=>{
    if(e.target.classList.contains('edit')){
        const theId = e.target.parentNode.dataset.id
        axios({
            url:`http://hmajax.itheima.net/api/books/${theId}`,

        }).then(result=>{
            const bookobj=result.data.data
            const keys=Object.keys(bookobj)
            keys.forEach(key=>{
                document.querySelector(`.edit-form .${key}`).value=bookobj[key]
            })     
        })
        editModal.show()
    }
})
document.querySelector('.edit-btn').addEventListener('click',()=>{
   
    // 提交保存并刷新
    const editForm =document.querySelector('.edit-form')
    const bookobj=serialize(editForm,{hash:true,empty:true})
    const{id,bookname,author,publisher}=bookobj
    axios({
        url:`http://hmajax.itheima.net/api/books/${id}`,
        method:'PUT',
        data:{
            bookname,
            author,
            publisher,
            creator
        }
    }).then(()=>{
        getBooksList()
    })

    editModal.hide()
})