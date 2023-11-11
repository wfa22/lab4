import React, { useState, useEffect } from 'react'
import {
    Box,
    Button,
    Flex,
    Input,
    List,
    ListItem,
    Spacer,
    Heading,
    Checkbox,
    Text,
    background,
} from '@chakra-ui/react'

export interface Task {
    //Интерфейс Task описывает структуру объекта, который представляет собой задачу (то есть "task"), и состоит из трех свойств:
    id: string // идентификатор задачи
    text: string // текст задачи
    completed: boolean // булево - флаг, указывающий, выполнена ли задача
}

export const Home = () => {
    const [todos, setTodos] = useState<Task[]>([])
    const [taskText, setTaskText] = useState('')
    const [nameFilter, setNameFilter] = useState('')
    const [stateFilter, setStateFilter] = useState<
        'all' | 'completed' | 'active'
    >('all')
    const [sortOrder, setSortOrder] = useState<'name' | 'state'>('name')

    useEffect(() => {
        //используется для загрузки данных из локального хранилища браузера (localStorage)
        //Он парсит данные из ключа 'todos' в localStorage и устанавливает их в состояние todos с помощью функции setTodos.
        //Пустой массив [] переданный вторым аргументом useEffect гарантирует, что эффект будет выполнен только один раз
        const localStorageTodos = JSON.parse(
            localStorage.getItem('todos') || '[]' //пытается получить значение из локального хранилища с ключом 'todos', и если такого значения нет или оно является ложным, то будет возвращена пустая строка в формате JSON
        )
        setTodos(localStorageTodos) // localStorageTodos это переменная (массив), которая содержит данные, полученные из локального хранилища браузера (localStorage).
    }, [])

    const addTask = () => {
        // Фунция  addTask , которая вызывается для добавления новой задачи в список дел
        if (taskText.trim() === '') return // Эта строка проверяет, является ли текст задачи (переменная  taskText ) пустым или состоящим только из пробелов.
        //Если это так, то функция просто завершается и ничего не происходит.
        const newTask: Task = {
            // Здесь создается новый объект задачи
            id: Date.now().toString(),
            text: taskText,
            completed: false,
        }
        const updatedTodos = [...todos, newTask] // Здесь создается новый массив  updatedTodos , который содержит все существующие задачи из состояния  todos  и новую задачу
        setTodos(updatedTodos) // используется для обновления состояния
        saveTodos(updatedTodos) //Сохраняет обновленный список дел
        setTaskText('') //Сброс значения переменной  taskText, чтобы очистить поле ввода задачи после добавления новой
    }

    const RemoveTodo = (id: string) => {
        //вызывается для удаления задачи из списка дел
        const updatedTodos = todos.filter((todo) => todo.id !== id) //фильтр оставляет только те задачи, у которых
        // идентификатор не равен переданному идентификатору, и создает новый массив с этими задачами
        setTodos(updatedTodos) //обновляет список
        saveTodos(updatedTodos) //сохраняет измененную версию
    }

    const SortChange = (order: 'name' | 'state') => {
        //вызывается при изменении порядка сортировки списка
        setSortOrder(order)
    }
    const FilterChange = (filter: 'all' | 'completed' | 'active') => {
        setStateFilter(filter)
    }

    const TaskCompletion = (id: string) => {
        //вызывается при изменении статуса выполнения задачи в списке дел
        const updatedTodos = todos.map((todo) => {
            //Здесь используется метод  map  для создания нового массива  updatedTodos,
            // который проходит по каждой задаче в состоянии  todos  и применяет функцию обратного вызова для каждой задачи
            if (todo.id === id) {
                //проверяется, совпадает ли идентификатор задачи с переданным идентификатором
                console.log(todo.completed) //Эта строка выводит текущий статус выполнения задачи в консоль
                return { ...todo, completed: !todo.completed } //Здесь создается новый объект задачи с помощью оператора расширения ( ...todo )
                // который копирует все свойства из исходной задачи
                // Затем, свойство  completed  обновляется на противоположное значение с помощью оператора  !
            }
            return todo
        })
        setTodos(updatedTodos)
        saveTodos(updatedTodos)
    }

    const ListExport = () => {
        // вызывается для экспорта списка дел в формате JSON
        const exportData = JSON.stringify(todos) // преобразует JavaScript объект или массив в формат JSON
        const blob = new Blob([exportData], { type: 'application/json' }) //создается новый объект, который принимает массив данных в качестве содержимого и указывает тип содержимого
        const url = URL.createObjectURL(blob) // создание url адреса, чтобы скачать файл
        const link = document.createElement('a')
        link.href = url //Свойство  href  устанавливается в значение URL-адреса
        link.download = 'todos.json' //указывает имя файла, который будет загружен при клике на ссылку
        link.click() //Это приведет к скачиванию файла
        URL.revokeObjectURL(url) //очистка URL-адреса, созданного ранее. Это помогает освободить ресурсы
    }

    const ListImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        //вызывается при импорте списка
        //Тут параметр функции, который ожидает передачу события изменения ввода (input change event) из элемента  <input>
        //Это событие происходит, когда пользователь выбирает файл для импорта
        const file = e.target.files[0] // Тут получается выбранный файл из элемента  <input>
        if (file) {
            //Здесь проверяется, существует ли выбранный файл
            const reader = new FileReader() //новый объект  FileReader , который позволяет читать содержимое
            reader.onload = (event) => {
                //обработчик события  onload  объекта  reader. Оно происходит, когда чтение файла завершено
                const importedData = JSON.parse(event.target.result as string) //преобразуется прочитанное содержимое файла
                setTodos(importedData) //Заменяет наш список импортированным
                saveTodos(importedData) // Ну и сохраняет его
            }
            reader.readAsText(file) // начинает чтение содержимого файла в формате текста
        }
    }

    const saveTodos = (updatedTodos: Task[]) => {
        //принимает обновленный список дел  и сохраняет его в локальном хранилище
        localStorage.setItem('todos', JSON.stringify(updatedTodos))
    }

    const filteredTodos = todos.filter((todo) => {
        //фильтрация списка дел
        //Метод применяется к массиву, чтобы создать новый массив filteredTodos, содержащий удовлетворяющие условиям элементы
        return (
            todo.text.includes(nameFilter) && //Cодержит ли текст задачи  подстроку, указанную в  nameFilter
            (stateFilter === 'all' || //Условие фильтрации по состоянию задачи
                (stateFilter === 'completed' && todo.completed) ||
                (stateFilter === 'active' && !todo.completed))
        )
    })

    // сортировкa списка дел
    const sortedTodos = [...filteredTodos] //Создание копии отфильтрованного списка дел
    if (sortOrder === 'name') {
        //Сортировка по имени задачи
        sortedTodos.sort((a, b) => a.text.localeCompare(b.text))
    } else {
        //Если сортировка не по имени, то значит по состоянию
        sortedTodos.sort((a, b) => {
            //сортирует задачи на основе их состояния выполнения
            if (a.completed && !b.completed) {
                return 1
            } else if (!a.completed && b.completed) {
                return -1
            } else {
                return 0
            }
        })
    }

    return (
        <Flex
            flexDirection="column"
            h="100vh"
            w="100vw"
            m="1rem"
            gap="1rem"
            alignItems="center"
        >
            <Heading size="lg" color={'blue.500'}>
                Cписок дел
            </Heading>
            <Spacer align="center" mb={10}>
                <Button
                    onClick={() => SortChange('name')}
                    mr={2}
                    colorScheme="blue"
                >
                    Сортировать по имени
                </Button>
                <Button onClick={() => SortChange('state')} colorScheme="blue">
                    Сортировать по состоянию
                </Button>
            </Spacer>
            <Flex align="center" mb={4}>
                <Input
                    type="text"
                    placeholder="Введите текст задачи"
                    value={taskText}
                    onChange={(e) => setTaskText(e.target.value)}
                    mr={101}
                />
                <Button
                    onClick={addTask}
                    colorScheme="green"
                    marginInline={-100}
                >
                    Добавить задачу
                </Button>
            </Flex>
            <Flex align="center" mb={4}>
                <Input
                    type="text"
                    placeholder="Фильтр по имени"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                />
            </Flex>
            <List>
                {sortedTodos.map((todo) => (
                    <ListItem
                        key={todo.id}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        borderBottom="2px solid #ccc"
                    >
                        <Box display="flex" alignItems="center">
                            <Checkbox
                                isChecked={todo.completed}
                                onChange={() => TaskCompletion(todo.id)}
                            />
                            <Text>{todo.text}</Text>
                        </Box>
                        <Button
                            onClick={() => RemoveTodo(todo.id)}
                            colorScheme="red"
                        >
                            Удалить
                        </Button>
                    </ListItem>
                ))}
            </List>
            <form onSubmit={ListExport}>
                <Button type="submit" mt={4}>
                    Экспорт
                </Button>
            </form>
            <Input type="file" accept=".json" onChange={ListImport} mt={4} />
        </Flex>
    )
}
