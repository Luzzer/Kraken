import Foundation

public enum UAGENTRemindersCommand: String, Codable, Sendable {
    case list = "reminders.list"
    case add = "reminders.add"
}

public enum UAGENTReminderStatusFilter: String, Codable, Sendable {
    case incomplete
    case completed
    case all
}

public struct UAGENTRemindersListParams: Codable, Sendable, Equatable {
    public var status: UAGENTReminderStatusFilter?
    public var limit: Int?

    public init(status: UAGENTReminderStatusFilter? = nil, limit: Int? = nil) {
        self.status = status
        self.limit = limit
    }
}

public struct UAGENTRemindersAddParams: Codable, Sendable, Equatable {
    public var title: String
    public var dueISO: String?
    public var notes: String?
    public var listId: String?
    public var listName: String?

    public init(
        title: String,
        dueISO: String? = nil,
        notes: String? = nil,
        listId: String? = nil,
        listName: String? = nil)
    {
        self.title = title
        self.dueISO = dueISO
        self.notes = notes
        self.listId = listId
        self.listName = listName
    }
}

public struct UAGENTReminderPayload: Codable, Sendable, Equatable {
    public var identifier: String
    public var title: String
    public var dueISO: String?
    public var completed: Bool
    public var listName: String?

    public init(
        identifier: String,
        title: String,
        dueISO: String? = nil,
        completed: Bool,
        listName: String? = nil)
    {
        self.identifier = identifier
        self.title = title
        self.dueISO = dueISO
        self.completed = completed
        self.listName = listName
    }
}

public struct UAGENTRemindersListPayload: Codable, Sendable, Equatable {
    public var reminders: [UAGENTReminderPayload]

    public init(reminders: [UAGENTReminderPayload]) {
        self.reminders = reminders
    }
}

public struct UAGENTRemindersAddPayload: Codable, Sendable, Equatable {
    public var reminder: UAGENTReminderPayload

    public init(reminder: UAGENTReminderPayload) {
        self.reminder = reminder
    }
}
