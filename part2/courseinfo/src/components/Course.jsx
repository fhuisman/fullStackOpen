const Header = ( {course} ) => {
    console.log(course)
    return (
        <h2>{course}</h2>
    )
}

const Content = ( {parts} ) => {
    console.log(parts)
    return (
        parts.map((part) => <Part key={part.id} part={part}/>)
    )
}

const Part = ( {part}) => {
    console.log(part)
    return (
        <li>{part.name} {part.exercises}</li>
    )
}

const Total = ({ parts }) => {
    console.log(parts)
    const sum = parts.reduce((total, part) => total + part.exercises, 0)
    return (
        <p><b>Number of exercises {sum}</b></p>
    )
}

const Course = ( {course} ) => {
    console.log(course)
    return (
        <div>
            <Header course={course.name}/>
            <Content parts={course.parts}/>
            <Total parts={course.parts} />
        </div>
)}

export default Course