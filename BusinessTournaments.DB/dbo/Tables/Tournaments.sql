CREATE TABLE [dbo].[Tournaments] (
    [Id]              INT            IDENTITY (1, 1) NOT NULL,
    [Tournament Name] NVARCHAR (50)  NOT NULL,
    [BracketsJsonString] NVARCHAR (MAX) NOT NULL,
    [Created]         DATETIME       NOT NULL,
    [Last Modified]   DATETIME       NULL,
    [CompanyId]       nvarchar(450)            NOT NULL,
    [IsCompleted]     BIT            NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    FOREIGN KEY ([CompanyId]) REFERENCES [dbo].[AspNetUsers] ([Id])
);

