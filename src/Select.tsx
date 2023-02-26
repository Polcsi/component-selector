import { useEffect, useRef, useState } from "react"
import styles from "./select.module.css"

export type SelectOption = {
    label: string,
    value: string | number
}

type MultipleSelectProps = {
    multiple: true
    value: SelectOption[]
    onChange: (value: SelectOption[]) => void
}

type SingleSelectProps = {
    multiple?: false
    value?: SelectOption
    onChange: (value: SelectOption | undefined) => void
}

type SelectProps = {
    options: SelectOption[]
} & (SingleSelectProps | MultipleSelectProps)

export function Select({multiple, value, onChange, options }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [hightlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    function clearOptions() {
        multiple ? onChange([]) : onChange(undefined)
    }

    function selectOption(option: SelectOption) {
        if(multiple) {
            if(value.includes(option)) {
                onChange(value.filter(o => o !== option))
            } else {
                onChange([...value, option])
            }
        } else {
            if(option !== value) onChange(option)
        }
    }

    function isOptionSelected(option: SelectOption) {
        return multiple ? value.includes(option) : option === value
    }

    useEffect(() => {
        if (isOpen) setHighlightedIndex(0)
    }, [isOpen])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if(e.target != containerRef.current) return
            switch(e.code) {
                case "Enter":
                
                    break;
                case "Space":
                    setIsOpen(prev => !prev);
                    if(isOpen) selectOption(options[hightlightedIndex]);
                    break;
                case "ArrowUp":
                case "ArrowDown":
                    if(!isOpen) {
                        setIsOpen(true)
                        break;
                    }
                    const newValue = hightlightedIndex + (e.code === "ArrowDown" ? 1 : -1)
                    if(newValue >= 0 && newValue < options.length) {
                        setHighlightedIndex(newValue);
                    }
                    break;
                case "Escape":
                    setIsOpen(false);
                    break;
            }
        }
        containerRef.current?.addEventListener("keydown", handler);

        return () => {
            containerRef.current?.removeEventListener("keydown", handler);
        }
    }, [isOpen, hightlightedIndex, options])

    return (
        <div ref={containerRef} tabIndex={0} className={styles.container} onClick={() => setIsOpen(prev => !prev)} onBlur={() => setIsOpen(false)}>
            <span className={styles.value}>{multiple ? value.map((v, index) => {
                return (
                    <button key={index} onClick={(e) => {
                        e.stopPropagation();
                        selectOption(v)
                    }} type="button" className={styles["multi-option"]}>{v.label}<span className={styles["close-multi-option"]}>&times;</span></button>
                )
            }) : value?.label}</span>
            <button onClick={e => {
                e.stopPropagation();
                clearOptions();
            }} className={styles["clear-btn"]}>&times;</button>
            <div className={styles.divider}></div>
            <div className={styles.caret}></div>
            <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
                {options.map((option, index) => (
                    <li 
                        onClick={e => {
                            e.stopPropagation();
                            selectOption(option);
                            setIsOpen(false);
                        }} 
                        key={option.label} 
                        className={`${styles.option} ${isOptionSelected(option) ? styles.selected : ""} ${index === hightlightedIndex ? styles.highlighted : ""}`}
                        onMouseEnter={() => setHighlightedIndex(index)}
                    >
                            {option.label}
                    </li>
                ))}
            </ul>
        </div>
    )
}
