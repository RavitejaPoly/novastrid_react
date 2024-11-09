import { useEffect, useState } from 'react'
import './App.css'
import { Box, Button, Checkbox, TextField, Typography } from '@mui/material'
import axios from 'axios'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useDispatch, useSelector } from 'react-redux';
import { setToDoList } from './redux/appSlice';


interface InitialTask {
  id: number,
  title: string,
  description: string,
  complete: boolean
}

interface todoItem {
  id: number,
  todo: string,
  completed: boolean,
  userId: number
}

function App() {
  const dispatch = useDispatch()
  const { toDoList } = useSelector((state: any) => state.app)
  const [count, setCount] = useState(0)
  const initialTask : InitialTask = {
    id: 0,
    title: '',
    description: '',
    complete: false
  }
  const [task, setTask] = useState(initialTask)
  const [todoList, setTodoList] = useState<InitialTask[]>([]);
  const [ isSelectStatus, setIsSelectStatus ] = useState("")
  const [ originalList , setOriginalList ] = useState<InitialTask[]>([])

  useEffect(() => {
    fetchData()
  }, [])


  const fetchData = async () => {
    try{
      const response = await axios.get('https://dummyjson.com/todos')
      console.log("response---->",response);
      if(response?.status === 200){
        const modifyData = response?.data?.todos.map((item: todoItem) => {
          return {
            id: item?.id,
            title: "",
            description: item?.todo,
            complete: item?.completed
          }
        })
        setTodoList(modifyData)
        setOriginalList(modifyData)
        setCount(modifyData?.length)
        dispatch(setToDoList(modifyData))
      }
    }catch(error){
      console.log("error in fetching data--->",error); 
    }
  }

  const handleTask = () => {
    const updateIdTask = {...task, id: count}
    setTodoList([ updateIdTask, ...todoList])
    setOriginalList([ updateIdTask, ...todoList])
    dispatch(setToDoList([ updateIdTask, ...todoList]))
    setCount(count + 1)
    setTask(initialTask)
  }

  const handleTitle = (value : string) => {
    setTask({...task, title: value})
  }

  const handleDescription = (value : string) => {
    setTask({...task, description: value})
  }

  const handleComplete = (id : number) => {
    const updateTask = todoList.map((task) => {
      if (task.id === id) {
        return {...task, complete: !task.complete}
      }
      return task
    })
    setTodoList(updateTask)
    setOriginalList(updateTask)
    dispatch(setToDoList(updateTask))
  }


  const handleDelete = (id : number) => {
    const updateTask = todoList.filter((task) => task.id !== id)
    setTodoList(updateTask)
    setOriginalList(updateTask)
    dispatch(setToDoList(updateTask))
  }

  const handleSelectStatus = (value : string) => {
    console.log("value---->",value);
    setIsSelectStatus(value)
    if(value === "completed"){
      const updateTask = originalList.filter((task) => task.complete === true)
      setTodoList(updateTask)
      dispatch(setToDoList(updateTask))
    }else if(value === "pending"){
      const updateTask = originalList.filter((task) => task.complete === false)
      setTodoList(updateTask)
      dispatch(setToDoList(updateTask))
    }else if(value === ""){
      setTodoList(originalList)
      dispatch(setToDoList(originalList))
    }
  }

  console.log("todo list---->",todoList);
  

  return (
    <Box>
    <Box sx={{display:'flex', flexDirection:'row', justifyContent:'center', marginTop:'2rem'}}>
      <Box>
        <Box>
          <TextField 
            id="title" 
            label="Title" 
            variant="outlined"  
            size='small' 
            sx={{marginBottom:'1rem'}}
            value = {task.title}
            onChange={(e) => handleTitle(e.target.value)} 
          />
        </Box>
        <Box>
          <TextField 
            id="description" 
            label="Description" 
            variant="outlined" 
            multiline 
            minRows={2} 
            size='small' 
            sx={{minWidth:'100%'}}
            value={task.description}
            onChange={(e) => handleDescription(e.target.value)}
          />
        </Box>
      </Box>
    </Box>
    <Box sx={{display:'flex', justifyContent:'center', marginTop:'1rem'}}>
      <Button variant="contained" onClick={() => handleTask()}>Add Task</Button>
    </Box>

    {/* filtering */}
    <Box sx={{display:'flex', justifyContent:'center',mt:2}}>
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="task-status">Task Status</InputLabel>
      <Select
        labelId="select-status"
        id="status-id"
        value={isSelectStatus}
        label="Task status"
        onChange={(e)=> handleSelectStatus(e.target.value)}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={"completed"}>Completed</MenuItem>
        <MenuItem value={"pending"}>Pending</MenuItem>
      </Select>
    </FormControl>
    </Box>

    {/* todo list */}
    
    <Typography sx={{display:'flex', justifyContent:'center', marginTop:'1rem'}}>Todo List</Typography>

    <Box sx={{display:'flex', justifyContent:'center', marginTop:'1rem', width:'100%'}}>
      <Box>
          {toDoList?.length > 0 && toDoList.map((item : InitialTask, index: number) => {
            return (
              <Box sx={{display:'flex', flexDirection:'row', justifyContent:'space-between', width:'20rem', marginBottom:'1rem'}}>
                  <Typography sx={{width:'1rem'}}> {index + 1}</Typography>
                <Box sx={{width:'10rem'}}>
                  <Typography> {item?.title}</Typography>
                  <Typography> {item?.description}</Typography>
                </Box>
                <Checkbox sx={{width:'1rem'}} checked={item?.complete}  onClick={() => {handleComplete(item?.id)}}/>
                <Button onClick={()=> {handleDelete(item?.id)}} variant='contained' size='small' sx={{marginLeft:'1rem', height:'2rem'}}>
                  Delete
                </Button>
              </Box>
            )
          })}
       
      </Box>
    </Box>

    </Box>
  )
}

export default App
