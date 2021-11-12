
import React, {useState, useEffect} from 'react'
import Node from './Node'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';


const Grid = () => {
    
    const [n, setN] = useState(15)
    const [m, setM] = useState(30)
    const [mode, setMode] = useState("#fff")
    const [mouse,setMouse] = useState(0)
    
    const [grid, setGrid] = useState([])
    const dx = [1,-1, 0, 0]
    const dy = [0, 0, 1, -1]
    const dep = ['D', 'U', 'R','L']

    useEffect(() => {
        makeGrid()
    }, [n,m])


    const makeGrid = () =>{
        const matrix = []
        for( let i=0 ; i<n ; i++){
            const line = []
            for(let j=0 ; j<m ; j++){
                const node = {
                    start : 0,
                    finish : 0,
                    visited : 0,
                    wall: 0,
                    color: "#fff"
                }
                if(!i && !j) {
                    node.start = 1
                    node.visited = 1
                }
                if(i == n-1 && j == m-1) node.finish = 1
                if(node.start) node.color = "#a9fc03"
                if(node.finish) node.color = "#fc2c03"
                line.push(node)
            }
            matrix.push(line);
        }
        setGrid(matrix)
    }



    const randomWall = () =>{
        let i = Math.random()
        if(i > 0.35) return 1
        return 0
    }
    const makeWalls = (x,y) =>{
        const matrix = []
        for(let i=0 ; i<n ; i++){
            const line = []
            for(let j=0 ; j<m; j++){
                const node = grid[i][j]
                if(x === i && y === j && !node.start && !node.finish) {
                    if(node.wall){
                        node.color = "#fff"
                    }
                    else node.color = "#000"
                    node.wall = 1 - node.wall
                }
                if(node.visited){
                    node.visited = 1 - node.visited
                    if(!node.start) node.color = "#fff"
                }
                line.push(node)
            }
            matrix.push(line);
        }
        setGrid(matrix)
    }
    const generateGrid = () =>{
        resetGrid()
        const matrix = []
        for( let i=0 ; i<n ; i++){
            const line = []
            for(let j=0 ; j<m ; j++){
                const node = grid[i][j]
                if(!((i===0 && j===0) || (i === n-1 && j === m-1))){
                    node.wall = randomWall()
                    if(node.wall){
                        node.color = "#fff"
                    }
                    else node.color = "#000"
                    node.wall = 1 - node.wall
                }
                line.push(node)
            }
            matrix.push(line);
        }
        setGrid(matrix)
    }



    const resetGrid = () => {
        const matrix = []
        for(let i=0 ; i<n ; i++){
            const line = []
            for(let j=0 ; j<m; j++){
                const node = grid[i][j]
                if(node.visited){
                    node.visited = 1 - node.visited
                    if(!node.start) node.color = "#fff"
                }
                line.push(node)
            }
            matrix.push(line);
        }
        setGrid(matrix)
    }
    
    
    /* ------- bfs functions start ----------*/
    const bfs = async () => {
        let queue = [[0,0]]
        const pre = []
        for( let i=0 ; i<n ; i++){
            const line = []
            for(let j=0 ; j<m ; j++){
                line.push([0,0])
            }
            pre.push(line);
        }
        while(queue.length != 0){
            let y = queue[0][1]
            let x = queue[0][0]
            let flag = 1
            for(let i=0; i<4; i++){
                if(validNode(x+dx[i],y+dy[i])){
                    pre[x+dx[i]][y+dy[i]] = [x, y]
                    if(grid[x+dx[i]][y+dy[i]].finish){
                        while(grid[x][y].start === 0){
                            setPath(x,y)
                            let x_copy = x
                            x = pre[x][y][0]
                            y = pre[x_copy][y][1]
                            await sleep(25)
                        }
                        console.log(pre)
                        return
                    }
                    queue.push([x+dx[i], y+dy[i]])
                    visitNode(x+dx[i] , y+dy[i])
                }
            }
            queue.shift()
            await sleep(1)
        }
    }

    const sleep = (delay) => new Promise((r) => setTimeout(r, delay))
    const visitNode = (x,y) =>{
        const matrix = []
        for(let i=0 ; i<n ; i++){
            const line = []
            for(let j=0 ; j<m; j++){
                const node = grid[i][j]
                if(x === i && y === j) {
                    node.visited = 1
                    node.color = "#91ceff"
                }
                line.push(node)
            }
            matrix.push(line);
        }
        setGrid(matrix)
    }
    const validNode = (x,y) =>{
        if(x >= 0 && x < n && y >= 0 && y < m && grid[x][y].wall === 0 && grid[x][y].visited === 0 && grid[x][y].start === 0) return 1
        return 0
    }
    const setPath = (x,y) =>{
        const matrix = []
        for(let i=0 ; i<n ; i++){
            const line = []
            for(let j=0 ; j<m; j++){
                let node = grid[i][j]
                if(i === x && j === y) node.color = "#ffff5e"
                line.push(node)
            }
            matrix.push(line);
        }
        setGrid(matrix)
    }
    /* ------------------- bfs functions ends -----------------*/

    
    



    return (
        <div className="Grid">
            <div className = "Buttons">
            <Button variant="primary" onClick = {() => bfs()}>  Find shortest path </Button>
            <RangeSlider
                value={n}
                min = {10}
                max = {20}
                onChange={changeEvent => setN(changeEvent.target.value)}
                size={'lg'}
            />
            <RangeSlider
                min = {20}
                max = {40}
                value={m}
                onChange={changeEvent => setM(changeEvent.target.value)}
            />
            <Button variant="secondary" onClick = {() => generateGrid()}> generate grid </Button>
            <Button variant="secondary" onClick = {() => resetGrid()}> reset grid </Button>
            <Button variant="secondary" onClick = {() => makeGrid()}> clear grid </Button>
            </div>
            <div style = {{marginTop: "70px"}}>
                {
                    grid.map((line, indexLine) => {
                        return <div key={indexLine} className="Line">
                            {
                                line.map((element, indexElement) => {
                                    
                                    return(
                                        <div 
                                            key = {indexLine*n+indexElement}
                                            style={{width:"100%"}}
                                            onClick = {() => makeWalls(indexLine,indexElement)}
                                            onMouseDown = {() =>setMouse(1) }
                                            onMouseUp = {() => setMouse(0)}
                                            onMouseOver = {() => {
                                                if(mouse === 1) makeWalls(indexLine, indexElement)
                                                }
                                            }
                                        >
                                            <Node 
                                                color = {element.color}
                                            />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    })
                }
            </div>
        </div>
    )
}

export default Grid
