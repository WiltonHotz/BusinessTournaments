CREATE TABLE [dbo].[Theme2Company]
(
	[Id] INT NOT NULL PRIMARY KEY identity,
	[ThemeId] int not null foreign key references Themes(Id),
	[CompanyId] nvarchar(450) not null foreign key references AspNetUsers(Id)
)
