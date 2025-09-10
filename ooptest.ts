
export interface Borrowable {
    borrow(memberName: string): string   
    returnItem(): string                 
    isAvailable(): boolean               
}

export abstract class LibraryItem implements Borrowable {
    private _title: string
    protected itemId: string
    private _available: boolean

    constructor(title: string, itemId: string) {
        this._title = title
        this.itemId = itemId
        this._available = true
    }

    public title(): string {
        return this._title
    }

    public id(): string {
        return this.itemId
    }

    public available(available: boolean): void {

        if (this._available && available) {
            console.warn(`Warning: Item ${this.title()} is already available`)
            return
        }

        if (!this._available && !available) {
            console.warn(`Warning: Item ${this.title()} is already borrowed`)
            return
        }

        this._available = available
        console.log(
            `Status updated: ${this.title()} is now ${available ? "available" : "unavailable"}`
        )
    }


    public abstract getDetails(): string

    public isAvailable(): boolean {
        return this._available
    }

    public borrow(memberName: string): string {
        if (!this._available) return "Book not available"
        this._available = false

        return `${this.constructor.name} ${this.title()} borrowed by ${memberName}`
    }

    public returnItem(): string {
        if (this._available) {
            return `${this.constructor.name} ${this.title()} returned`
        }
        this._available = true
        return `${this.constructor.name} ${this.title()} returned`
    }
}

export class Book extends LibraryItem {
    private author: string

    constructor(title: string, itemId: string, author: string) {
        super(title, itemId)
        this.author = author
    }

    public getDetails(): string {
        return `Book: ${this.title()} by ${this.author} (ID: ${this.id()})`
    }
}

export class Magazine extends LibraryItem {
    private issueDate: string

    constructor(title: string, itemId: string, issueDate: string) {
        super(title, itemId)
        this.issueDate = issueDate
    }

    public getDetails(): string {
        return `Magazine: ${this.title()} (Issue: ${this.issueDate}, ID: ${this.id()})`
    }
}

export class DVD extends LibraryItem {
    private duration: number

    constructor(title: string, itemId: string, duration: number) {
        super(title, itemId)
        this.duration = duration
    }

    public getDetails(): string {
        return `DVD: ${this.title()} (${this.duration} mins, ID: ${this.id()})`
    }
}

export class LibraryMember {
    private _memberName: string
    private _memberId: string
    private _borrowedItems: LibraryItem[]

    constructor(memberName: string, memberId: string) {
        this._memberName = memberName
        this._memberId = memberId
        this._borrowedItems = []
    }

    public memberName(): string {
        return this._memberName
    }

    public memberId(): string {
        return this._memberId
    }

    public borrowItem(item: LibraryItem): string {
        if (!item.isAvailable()) return "Item not available"
        const msg = item.borrow(this._memberName)
        if (msg !== "Item not available") {
            this._borrowedItems.push(item)
        }
        return msg
    }

    public returnItem(itemId: string): string {
        const idx = this._borrowedItems.findIndex((it) => it.id() === itemId)
        if (idx === -1) return "Item not found in member's borrowed list"
        const item = this._borrowedItems[idx]
        const msg = item.returnItem()
        // ลบออกจากรายการที่ยืม
        this._borrowedItems.splice(idx, 1)
        return msg
    }

    public listBorrowedItems(): string {
        if (this._borrowedItems.length === 0) return "No borrowed items"
        return this._borrowedItems.map((it) => it.getDetails()).join("\n")
    }
}

export class Library {
    private items: LibraryItem[] = [];
    private members: LibraryMember[] = [];

    public addItem(item: LibraryItem): void {
        if (this.findItemById(item.id())) {
            throw new Error(`Duplicate item id: ${item.id()}`)
        }
        this.items.push(item)
    }

    public addMember(member: LibraryMember): void {
        if (this.findMemberById(member.memberId())) {
            throw new Error(`Duplicate member id: ${member.memberId()}`)
        }
        this.members.push(member)
    }

    public findItemById(itemId: string): LibraryItem | undefined {
        return this.items.find((it) => it.id() === itemId)
    }

    public findMemberById(memberId: string): LibraryMember | undefined {
        return this.members.find((m) => m.memberId() === memberId)
    }

    public borrowItem(memberId: string, itemId: string): string {
        const member = this.findMemberById(memberId)
        if (!member) return "Member not found"
        const item = this.findItemById(itemId)
        if (!item) return "Item not found"
        return member.borrowItem(item)
    }

    public returnItem(memberId: string, itemId: string): string {
        const member = this.findMemberById(memberId)
        if (!member) return "Member not found"
        return member.returnItem(itemId)
    }

    public getLibrarySummary(): string {
        const itemsSummary =
            this.items.length === 0
                ? "No items"
                : this.items.map((it) => it.getDetails()).join("\n")

        const membersSummary =
            this.members.length === 0
                ? "No members"
                : this.members.map((m) => `Member: ${m.memberName()} (${m.memberId()})`).join("\n")

        return `=== Items ===\n${itemsSummary}\n\n=== Members ===\n${membersSummary}`
    }
}

const book = new Book("Harry Potter", "B001", "J.K. Rowling")
const member = new LibraryMember("Alice", "MEM001")
const member2 = new LibraryMember("fern", "MEM002")
const library = new Library()

library.addItem(book)
library.addMember(member)
library.addMember(member2)

console.log(library.borrowItem("MEM001", "B001"))
console.log(library.borrowItem("MEM002", "B001"))
console.log(member.listBorrowedItems())
console.log(member2.listBorrowedItems())
console.log(library.returnItem("MEM001", "B001"));




