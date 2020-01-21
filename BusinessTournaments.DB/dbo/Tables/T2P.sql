CREATE TABLE [dbo].[T2P] (
    [Id]           INT IDENTITY (1, 1) NOT NULL,
    [PlayerID]     INT NOT NULL,
    [TournamentID] INT NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    FOREIGN KEY ([PlayerID]) REFERENCES [dbo].[Players] ([Id]),
    FOREIGN KEY ([TournamentID]) REFERENCES [dbo].[Tournaments] ([Id])
);

