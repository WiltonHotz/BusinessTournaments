CREATE TABLE [dbo].[Players] (
    [Id]        INT           IDENTITY (1, 1) NOT NULL,
    [Name]      NVARCHAR (23) NOT NULL,
    [CompanyID] Nvarchar(450)           NOT NULL,
    [Score]     INT           Not NULL,
    UNIQUE ([Name], [CompanyID]),
    PRIMARY KEY CLUSTERED ([Id] ASC),
    FOREIGN KEY ([CompanyID]) REFERENCES [dbo].[AspNetUsers] ([Id]),
);

