/**
 * C# and .NET MAUI Notes Page
 * A detailed note for C# syntax, .NET MAUI project structure, XAML, code-behind, MVVM, DI, Shell navigation, services, and production patterns.
 */

import { NotesLayout } from '../../../components/notes/NotesLayout';
import {
  BulletList,
  CodeBlock,
  NoteHeader,
  NoteParagraph,
  NoteSectionTitle,
  NoteSubSectionTitle,
  NoteTable,
  NoteTopicBlock,
  NoteTopicGroup,
  RelatedNotes,
} from '../../../components/notes';

export default function CSharpDotNetMauiNote() {
  return (
    <NotesLayout>
      <NoteHeader
        title="C# and .NET MAUI"
        subtitle="A practical deep dive into modern C#, .NET MAUI, XAML, code-behind, MVVM, project structure, dependency injection, Shell navigation, services, platform code, testing, and production app architecture."
      />

      <RelatedNotes
        links={[
          { href: '/notes/intro-java', label: 'Java and Data Structures', note: 'Compare C# classes, interfaces, generics, async, and managed references with a nearby object-oriented language.' },
          { href: '/notes/c-programming', label: 'C Programming', note: 'Contrast MAUI managed memory, runtime services, and async programming with lower-level manual resource management.' },
          { href: '/notes/web-frameworks-and-tooling', label: 'Web Frameworks and Tooling', note: 'Connect client app services to REST APIs, dependency injection, testing, and deployment concerns.' },
          { href: '/notes/information-security', label: 'Information Security', note: 'Use secure storage, authentication flows, network hardening, and least-privilege permissions correctly in apps.' },
        ]}
      />

      <NoteSectionTitle id="current-dotnet-maui-stack-map">1. Current .NET MAUI Stack Map</NoteSectionTitle>
      <NoteParagraph>
        .NET MAUI, short for .NET Multi-platform App UI, is Microsoft's cross-platform framework for building native mobile and desktop apps with C# and XAML from one shared project. It targets Android, iOS, macOS through Mac Catalyst, and Windows through WinUI 3. The same solution can also contain class libraries, API clients, unit tests, and platform-specific code when needed.
      </NoteParagraph>
      <NoteParagraph>
        As of June 2026, the current .NET line is .NET 10, an LTS release. Enterprise projects may still target .NET 8 or .NET 9, so always read the project file before assuming which C# language version, MAUI workload, Android SDK, Xcode, JDK, and Windows App SDK versions apply.
      </NoteParagraph>
      <NoteTable
        headers={['layer', 'what it contributes', 'files you usually touch']}
        rows={[
          ['C# language', 'types, classes, records, interfaces, async/await, LINQ, events, generics, nullable reference analysis, pattern matching', '.cs files such as Models, ViewModels, Services, and code-behind'],
          ['.NET runtime and BCL', 'garbage collection, tasks, HTTP, JSON, collections, streams, dependency injection primitives, base APIs', 'shared libraries, service classes, test projects'],
          ['.NET MAUI controls', 'ContentPage, Grid, CollectionView, Button, Entry, Shell, handlers, resources, platform APIs', '.xaml and .xaml.cs files'],
          ['XAML', 'declarative UI tree, data bindings, styles, resources, visual states, templates', 'Views, Pages, AppShell.xaml, App.xaml'],
          ['Code-behind', 'view constructor, InitializeComponent, event handlers, lightweight view-only behavior', '*.xaml.cs partial classes'],
          ['MVVM', 'separates visual UI from state and behavior through ViewModels, bindings, and commands', 'ViewModels, Models, Services, Views'],
          ['Platform projects', 'manifests, permissions, entitlements, app lifecycle hooks, native APIs, platform-specific assets', 'Platforms/Android, Platforms/iOS, Platforms/MacCatalyst, Platforms/Windows'],
        ]}
      />
      <NoteTopicGroup>
        <NoteTopicBlock title="Mental Model">
          <NoteParagraph className="mb-0">
            XAML describes what the screen contains. Code-behind wires the generated partial class and handles view-only concerns. The ViewModel exposes state and commands. Services perform work. Models and DTOs represent data. MAUI maps the shared UI abstraction to native platform controls through handlers.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="csharp-program-shape-and-syntax">2. C# Program Shape and Syntax</NoteSectionTitle>
      <NoteParagraph>
        C# is a statically typed, managed, object-oriented language with strong support for functional-style expressions. In a MAUI app, most code lives in classes, records, interfaces, and partial classes. Source files are usually organized by namespace, and modern projects commonly use file-scoped namespaces to reduce indentation.
      </NoteParagraph>
      <CodeBlock
        language="csharp"
        code={`
namespace FieldOps.Models;

public sealed record WorkOrder(
    int Id,
    string Title,
    string CustomerName,
    WorkOrderStatus Status,
    DateTimeOffset DueAt);

public enum WorkOrderStatus
{
    New,
    InProgress,
    Blocked,
    Complete
}
        `}
      />
      <NoteTable
        headers={['syntax', 'meaning in C#']}
        rows={[
          [<code>namespace FieldOps.Models;</code>, 'file-scoped namespace; all types in the file belong to that namespace'],
          [<code>public</code>, 'type or member can be used from other assemblies if referenced'],
          [<code>sealed</code>, 'class cannot be inherited; often useful for ViewModels and services unless extension is intended'],
          [<code>record</code>, 'data-focused reference type with generated value equality, constructor, deconstruction, and useful ToString output'],
          [<code>enum</code>, 'named integer-backed set of values'],
          [<code>string</code>, 'reference type representing text; nullable analysis distinguishes string from string?'],
          [<code>DateTimeOffset</code>, 'date/time plus offset; usually better than DateTime for API-facing app data'],
        ]}
      />
      <NoteParagraph>
        A semicolon ends most statements. Braces define blocks. Dot access calls members. Parentheses call methods and constructors. Angle brackets express generics. Square brackets index collections or apply attributes depending on context.
      </NoteParagraph>

      <NoteSectionTitle id="types-values-nullability-and-collections">3. Types, Values, Nullability, and Collections</NoteSectionTitle>
      <NoteParagraph>
        C# distinguishes value types and reference types. Value types include primitives, structs, and enums; variables usually hold the value directly. Reference types include classes, records, strings, arrays, and most UI objects; variables hold references to objects managed by the runtime.
      </NoteParagraph>
      <NoteTable
        headers={['category', 'examples', 'MAUI usage']}
        rows={[
          ['value types', 'int, bool, double, decimal, DateTimeOffset, Guid, enum, struct', 'IDs, flags, numeric inputs, selected enum values, timestamps'],
          ['reference types', 'string, object, ContentPage, HttpClient, List<T>, ViewModel classes', 'pages, controls, services, DTOs, collections'],
          ['nullable value types', 'int?, bool?, DateTimeOffset?', 'optional form values, API values that can be absent'],
          ['nullable reference types', 'string?, WorkOrder?', 'explicitly mark references that can be null when nullable analysis is enabled'],
          ['generic collections', 'List<T>, Dictionary<TKey,TValue>, ObservableCollection<T>', 'in-memory data, lookup tables, UI-bound collections'],
        ]}
      />
      <CodeBlock
        language="csharp"
        code={`
List<WorkOrder> loadedOrders = [];
Dictionary<int, WorkOrder> byId = [];
WorkOrder? selectedOrder = null;

if (selectedOrder is not null)
{
    Console.WriteLine(selectedOrder.Title);
}
        `}
      />
      <NoteTopicGroup>
        <NoteTopicBlock title="Nullable Reference Types">
          <NoteParagraph>
            Nullable reference analysis is compile-time help, not runtime magic. If a property is declared as <code>string</code>, the compiler expects it to never be null after initialization. If a property is declared as <code>string?</code>, callers must handle the null case.
          </NoteParagraph>
          <CodeBlock
            language="xml"
            code={`
<PropertyGroup>
  <Nullable>enable</Nullable>
  <ImplicitUsings>enable</ImplicitUsings>
</PropertyGroup>
            `}
          />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="properties-fields-methods-and-constructors">4. Properties, Fields, Methods, and Constructors</NoteSectionTitle>
      <NoteParagraph>
        MAUI code relies heavily on properties because XAML bindings bind to public properties. Fields store implementation details. Constructors initialize an object. Methods perform actions. Properties should be cheap to read; expensive or asynchronous work belongs in methods or commands.
      </NoteParagraph>
      <CodeBlock
        language="csharp"
        code={`
public sealed class WorkOrderSummary
{
    private readonly TimeProvider _clock;

    public WorkOrderSummary(WorkOrder order, TimeProvider clock)
    {
        Order = order;
        _clock = clock;
    }

    public WorkOrder Order { get; }

    public bool IsOverdue => Order.Status != WorkOrderStatus.Complete &&
                             Order.DueAt < _clock.GetUtcNow();

    public string DisplayStatus()
    {
        return IsOverdue ? "Overdue" : Order.Status.ToString();
    }
}
        `}
      />
      <NoteTable
        headers={['member', 'example', 'design rule']}
        rows={[
          ['field', <code>private readonly TimeProvider _clock;</code>, 'private state; prefer readonly for constructor dependencies'],
          ['constructor', <code>public WorkOrderSummary(...)</code>, 'make required dependencies explicit'],
          ['property', <code>public WorkOrder Order {'{'} get; {'}'}</code>, 'bindable public data surface'],
          ['expression-bodied property', <code>public bool IsOverdue =&gt; ...</code>, 'good for cheap derived values'],
          ['method', <code>public string DisplayStatus()</code>, 'use when work requires arguments, branching, side effects, or nontrivial computation'],
        ]}
      />

      <NoteSectionTitle id="async-await-events-and-commands">5. Async, Await, Events, and Commands</NoteSectionTitle>
      <NoteParagraph>
        Mobile and desktop apps must keep the UI thread responsive. Network calls, file I/O, database work, and long CPU work should not block the UI thread. C# expresses asynchronous operations with <code>Task</code>, <code>Task&lt;T&gt;</code>, <code>async</code>, and <code>await</code>.
      </NoteParagraph>
      <CodeBlock
        language="csharp"
        code={`
public async Task<IReadOnlyList<WorkOrder>> LoadOpenOrdersAsync(
    CancellationToken cancellationToken)
{
    using HttpResponseMessage response =
        await _httpClient.GetAsync("api/work-orders/open", cancellationToken);

    response.EnsureSuccessStatusCode();

    WorkOrderDto[]? dto =
        await response.Content.ReadFromJsonAsync<WorkOrderDto[]>(cancellationToken);

    return dto?.Select(WorkOrderMapper.ToModel).ToList() ?? [];
}
        `}
      />
      <NoteParagraph>
        Events are callbacks raised by objects. Code-behind event handlers are common for view-only events, but MVVM prefers commands for user intent because commands live in the ViewModel and can be unit tested.
      </NoteParagraph>
      <NoteTable
        headers={['construct', 'where it belongs', 'example']}
        rows={[
          ['event handler', 'code-behind when the behavior is visual and tightly coupled to the view', 'focus an Entry, scroll to top, respond to SizeChanged'],
          ['ICommand', 'ViewModel when the user intent changes app state or calls services', 'SaveCommand, RefreshCommand, SelectOrderCommand'],
          ['async method', 'ViewModel or service when work crosses I/O boundaries', 'LoadAsync, SaveAsync, AuthenticateAsync'],
          ['CancellationToken', 'service and ViewModel operations that may outlive the page', 'cancel a refresh when leaving the page'],
        ]}
      />

      <NoteSectionTitle id="project-file-target-frameworks-and-workloads">6. Project File, Target Frameworks, and Workloads</NoteSectionTitle>
      <NoteParagraph>
        A MAUI project is an SDK-style .NET project with <code>UseMaui</code> enabled. The project file controls target frameworks, app identity, supported OS versions, resources, NuGet packages, nullable analysis, implicit usings, and build behavior.
      </NoteParagraph>
      <CodeBlock
        language="xml"
        code={`
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFrameworks>net10.0-android;net10.0-ios;net10.0-maccatalyst</TargetFrameworks>
    <TargetFrameworks Condition="$([MSBuild]::IsOSPlatform('windows'))">
      $(TargetFrameworks);net10.0-windows10.0.19041.0
    </TargetFrameworks>

    <OutputType>Exe</OutputType>
    <RootNamespace>FieldOps</RootNamespace>
    <UseMaui>true</UseMaui>
    <SingleProject>true</SingleProject>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>

    <ApplicationTitle>FieldOps</ApplicationTitle>
    <ApplicationId>com.example.fieldops</ApplicationId>
    <ApplicationDisplayVersion>1.0</ApplicationDisplayVersion>
    <ApplicationVersion>1</ApplicationVersion>

    <SupportedOSPlatformVersion Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'android'">21.0</SupportedOSPlatformVersion>
    <SupportedOSPlatformVersion Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'ios'">12.2</SupportedOSPlatformVersion>
    <SupportedOSPlatformVersion Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'maccatalyst'">12.0</SupportedOSPlatformVersion>
    <SupportedOSPlatformVersion Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'windows'">10.0.17763.0</SupportedOSPlatformVersion>
    <TargetPlatformMinVersion Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'windows'">10.0.17763.0</TargetPlatformMinVersion>
  </PropertyGroup>

  <ItemGroup>
    <MauiIcon Include="Resources\\AppIcon\\appicon.svg" ForegroundFile="Resources\\AppIcon\\appiconfg.svg" Color="#512BD4" />
    <MauiSplashScreen Include="Resources\\Splash\\splash.svg" Color="#512BD4" BaseSize="128,128" />
    <MauiImage Include="Resources\\Images\\*" />
    <MauiFont Include="Resources\\Fonts\\*" />
    <MauiAsset Include="Resources\\Raw\\**" LogicalName="%(RecursiveDir)%(Filename)%(Extension)" />
  </ItemGroup>
</Project>
        `}
      />
      <NoteTable
        headers={['property or item', 'meaning']}
        rows={[
          [<code>TargetFrameworks</code>, 'multi-targets platform-specific builds such as net10.0-android and net10.0-windows10.0.19041.0'],
          [<code>UseMaui</code>, 'turns on MAUI build targets, XAML processing, resources, and platform packaging'],
          [<code>SingleProject</code>, 'keeps shared resources and platform targets in one project instead of separate heads'],
          [<code>SupportedOSPlatformVersion</code>, 'declares minimum supported platform versions and helps analyzers catch unsupported API usage'],
          [<code>MauiImage</code>, 'source image resource; build generates platform-specific image outputs'],
          [<code>MauiFont</code>, 'font resource registered by alias or filename'],
          [<code>MauiAsset</code>, 'raw file copied into platform packages'],
        ]}
      />
      <NoteParagraph>
        Tooling is workload-based. A machine needs the .NET SDK plus MAUI workloads and platform toolchains. Windows can build Android and Windows targets directly. iOS and Mac Catalyst builds require Apple tooling, so iOS development from Windows requires a paired networked Mac.
      </NoteParagraph>
      <CodeBlock
        language="powershell"
        code={`
dotnet workload list
dotnet workload install maui
dotnet new maui -n FieldOps
dotnet build -f net10.0-android
dotnet build -f net10.0-windows10.0.19041.0
        `}
      />

      <NoteSectionTitle id="maui-file-structure">7. .NET MAUI File Structure</NoteSectionTitle>
      <NoteParagraph>
        A clean MAUI app separates startup, views, viewmodels, models, services, resources, and platform-specific code. Real enterprise apps often add folders for navigation, validation, persistence, authentication, telemetry, feature flags, and environment configuration.
      </NoteParagraph>
      <CodeBlock
        language="text"
        code={`
FieldOps/
  FieldOps.csproj
  MauiProgram.cs
  App.xaml
  App.xaml.cs
  AppShell.xaml
  AppShell.xaml.cs

  Models/
    WorkOrder.cs
    WorkOrderStatus.cs

  Dtos/
    WorkOrderDto.cs

  Services/
    IWorkOrderService.cs
    WorkOrderService.cs
    IConnectivityService.cs
    SecureTokenStore.cs

  ViewModels/
    ViewModelBase.cs
    OrdersViewModel.cs
    OrderDetailViewModel.cs

  Views/
    OrdersPage.xaml
    OrdersPage.xaml.cs
    OrderDetailPage.xaml
    OrderDetailPage.xaml.cs

  Resources/
    AppIcon/
    Fonts/
    Images/
    Raw/
    Styles/
      Colors.xaml
      Styles.xaml

  Platforms/
    Android/
      AndroidManifest.xml
      MainActivity.cs
      MainApplication.cs
    iOS/
      AppDelegate.cs
      Info.plist
    MacCatalyst/
      AppDelegate.cs
      Info.plist
    Windows/
      app.manifest
      Package.appxmanifest
      App.xaml
        `}
      />
      <NoteTable
        headers={['file', 'role']}
        rows={[
          ['MauiProgram.cs', 'application bootstrapper; creates the MauiApp, registers fonts, handlers, logging, services, pages, and ViewModels'],
          ['App.xaml', 'application-level resources, merged dictionaries, colors, styles'],
          ['App.xaml.cs', 'application class; commonly sets MainPage to AppShell and handles app-wide lifecycle hooks'],
          ['AppShell.xaml', 'top-level navigation structure: flyout, tabs, routes, ShellContent'],
          ['Views/*.xaml', 'declarative UI for pages or reusable controls'],
          ['Views/*.xaml.cs', 'partial class code-behind generated partner; constructor and view-only event handlers'],
          ['ViewModels/*.cs', 'state, commands, validation, loading flags, and service orchestration'],
          ['Services/*.cs', 'HTTP, persistence, device APIs, authentication, business workflows'],
          ['Resources/Styles/*.xaml', 'global styles, colors, theme resources, control defaults'],
          ['Platforms/*', 'native entry points, manifests, permissions, entitlements, and platform-specific implementation details'],
        ]}
      />

      <NoteSectionTitle id="xaml-fundamentals">8. XAML Fundamentals</NoteSectionTitle>
      <NoteParagraph>
        XAML is XML that creates object graphs. The root element declares the default MAUI XML namespace, the XAML language namespace, optional CLR namespaces, and <code>x:Class</code>. The <code>x:Class</code> value connects the XAML file to a generated partial C# class with the same fully qualified name.
      </NoteParagraph>
      <CodeBlock
        language="xml"
        code={`
<ContentPage
    x:Class="FieldOps.Views.OrdersPage"
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:vm="clr-namespace:FieldOps.ViewModels"
    x:DataType="vm:OrdersViewModel"
    Title="Orders">

    <Grid RowDefinitions="Auto,*" Padding="16" RowSpacing="12">
        <SearchBar
            Placeholder="Search orders"
            Text="{Binding SearchText}" />

        <CollectionView
            Grid.Row="1"
            ItemsSource="{Binding FilteredOrders}"
            SelectionMode="None">
            <CollectionView.ItemTemplate>
                <DataTemplate x:DataType="vm:WorkOrderRowViewModel">
                    <Grid ColumnDefinitions="*,Auto" Padding="8">
                        <VerticalStackLayout>
                            <Label Text="{Binding Title}" FontAttributes="Bold" />
                            <Label Text="{Binding CustomerName}" FontSize="12" />
                        </VerticalStackLayout>
                        <Button
                            Grid.Column="1"
                            Text="Open"
                            Command="{Binding Source={RelativeSource AncestorType={x:Type vm:OrdersViewModel}}, Path=OpenOrderCommand}"
                            CommandParameter="{Binding .}" />
                    </Grid>
                </DataTemplate>
            </CollectionView.ItemTemplate>
        </CollectionView>
    </Grid>
</ContentPage>
        `}
      />
      <NoteTable
        headers={['XAML feature', 'meaning']}
        rows={[
          [<code>xmlns</code>, 'maps XML element names to MAUI controls and XAML language features'],
          [<code>x:Class</code>, 'declares the generated partial class paired with code-behind'],
          [<code>x:DataType</code>, 'enables compiled binding checks and better binding performance'],
          [<code>{'{Binding Title}'}</code>, 'binds a target property to the BindingContext.Title property'],
          [<code>Grid.Row</code>, 'attached property that sets layout metadata on a child element'],
          [<code>DataTemplate</code>, 'template used to render each item in a collection'],
          [<code>RelativeSource</code>, 'lets a binding reach another object, such as the page ViewModel from inside an item template'],
        ]}
      />
      <NoteTopicGroup>
        <NoteTopicBlock title="ContentPage Rule">
          <NoteParagraph className="mb-0">
            A <code>ContentPage</code> has one content child. If the page needs multiple controls, use a layout such as <code>Grid</code>, <code>VerticalStackLayout</code>, <code>HorizontalStackLayout</code>, <code>FlexLayout</code>, or <code>AbsoluteLayout</code> as the single child.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="code-behind-and-partial-classes">9. Code-Behind and Partial Classes</NoteSectionTitle>
      <NoteParagraph>
        Code-behind is the C# file paired with a XAML file. It is a partial class because part of the class is generated from XAML and part is handwritten. The constructor almost always calls <code>InitializeComponent()</code>, which loads and connects the XAML object tree.
      </NoteParagraph>
      <CodeBlock
        language="csharp"
        code={`
namespace FieldOps.Views;

public partial class OrdersPage : ContentPage
{
    private readonly OrdersViewModel _viewModel;

    public OrdersPage(OrdersViewModel viewModel)
    {
        InitializeComponent();
        _viewModel = viewModel;
        BindingContext = _viewModel;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        await _viewModel.LoadAsync();
    }
}
        `}
      />
      <NoteParagraph>
        Keep code-behind thin. It is acceptable for visual lifecycle, focus, animation, page-specific interaction, platform view tweaks, and assigning the BindingContext. Move business decisions, data loading, validation, and save behavior into the ViewModel or services.
      </NoteParagraph>
      <NoteTable
        headers={['good code-behind responsibility', 'poor code-behind responsibility']}
        rows={[
          ['set BindingContext when using constructor injection', 'call backend APIs directly from button click handlers'],
          ['start a view animation or focus an Entry', 'decide business validation rules'],
          ['handle SizeChanged for a custom layout adjustment', 'build SQL, parse DTOs, or mutate global app state'],
          ['bridge view lifecycle to a ViewModel method', 'store long-lived application state in page fields'],
        ]}
      />

      <NoteSectionTitle id="mvvm-architecture">10. MVVM Architecture</NoteSectionTitle>
      <NoteParagraph>
        MVVM means Model-View-ViewModel. The View is the XAML and code-behind. The ViewModel is a C# object that exposes bindable state and commands. The Model is domain data and business concepts. Services do work for the ViewModel, such as API calls, persistence, authentication, device APIs, or workflow operations.
      </NoteParagraph>
      <NoteTable
        headers={['part', 'owns', 'should not own']}
        rows={[
          ['View', 'visual tree, layout, styles, control events, view lifecycle', 'business rules, API clients, storage, validation policies'],
          ['Code-behind', 'InitializeComponent, BindingContext assignment, view-only events', 'application workflow decisions'],
          ['ViewModel', 'screen state, loading flags, selected item, commands, validation messages, service orchestration', 'direct references to Button, Label, Entry, or platform UI controls'],
          ['Model', 'domain concepts and invariants', 'UI colors, navigation, page lifecycle'],
          ['Service', 'I/O, APIs, persistence, auth, native device services, cross-screen workflows', 'formatting details for one page unless explicitly a UI service'],
        ]}
      />
      <NoteTopicGroup>
        <NoteTopicBlock title="MVVM Dependency Direction">
          <BulletList className="mb-0">
            <li>The View knows about its ViewModel through <code>BindingContext</code>.</li>
            <li>The ViewModel does not know which concrete page displays it.</li>
            <li>The ViewModel depends on service interfaces, not raw platform implementation details.</li>
            <li>The Model does not know about ViewModels or Views.</li>
            <li>Navigation can be abstracted behind a service, or Shell calls can be centralized in ViewModels when the app is small.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="binding-context-binding-modes-and-compiled-bindings">11. BindingContext, Binding Modes, and Compiled Bindings</NoteSectionTitle>
      <NoteParagraph>
        The <code>BindingContext</code> is the default source object for bindings on a view and its children. A page usually sets its BindingContext to a ViewModel. Collection item templates set their BindingContext to the current item, which is why reaching the parent ViewModel from inside a template requires a relative-source binding or command forwarding.
      </NoteParagraph>
      <NoteTable
        headers={['binding mode', 'direction', 'common controls']}
        rows={[
          ['OneWay', 'source updates target', 'Label.Text, Image.Source, IsVisible'],
          ['TwoWay', 'source and target update each other', 'Entry.Text, SearchBar.Text, Slider.Value, Switch.IsToggled'],
          ['OneTime', 'source updates target once when context is set', 'static labels or configuration values'],
          ['OneWayToSource', 'target updates source', 'rare; useful for reading control-generated values'],
        ]}
      />
      <CodeBlock
        language="xml"
        code={`
<Entry
    Text="{Binding TechnicianName, Mode=TwoWay}"
    Placeholder="Technician name" />

<Label
    Text="{Binding TechnicianName, StringFormat='Assigned to {0}'}" />

<Button
    Text="Save"
    Command="{Binding SaveCommand}"
    IsEnabled="{Binding CanSave}" />
        `}
      />
      <NoteParagraph>
        Prefer <code>x:DataType</code> on pages and templates. It enables compiled bindings, catches many misspelled property names at build time, improves IntelliSense, and avoids some runtime reflection overhead.
      </NoteParagraph>

      <NoteSectionTitle id="viewmodel-base-and-property-change">12. ViewModelBase and Property Change</NoteSectionTitle>
      <NoteParagraph>
        Data binding needs change notifications. A normal C# property does not automatically tell the UI that it changed. The standard mechanism is <code>INotifyPropertyChanged</code>. A base class keeps this repetitive code consistent.
      </NoteParagraph>
      <CodeBlock
        language="csharp"
        code={`
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace FieldOps.ViewModels;

public abstract class ViewModelBase : INotifyPropertyChanged
{
    public event PropertyChangedEventHandler? PropertyChanged;

    private bool _isBusy;
    public bool IsBusy
    {
        get => _isBusy;
        set => SetProperty(ref _isBusy, value);
    }

    protected bool SetProperty<T>(
        ref T storage,
        T value,
        [CallerMemberName] string propertyName = "")
    {
        if (EqualityComparer<T>.Default.Equals(storage, value))
        {
            return false;
        }

        storage = value;
        OnPropertyChanged(propertyName);
        return true;
    }

    protected void OnPropertyChanged([CallerMemberName] string propertyName = "")
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
}
        `}
      />
      <NoteParagraph>
        CommunityToolkit.Mvvm can generate much of this with attributes such as <code>[ObservableProperty]</code> and <code>[RelayCommand]</code>. Many teams still need to understand the manual version because generated code follows the same concepts and older enterprise projects may not use the toolkit.
      </NoteParagraph>

      <NoteSectionTitle id="observablecollection-and-ui-threading">13. ObservableCollection and UI Threading</NoteSectionTitle>
      <NoteParagraph>
        A ViewModel property change can update bound UI. A collection also needs collection-change notifications when items are added, removed, or cleared. <code>ObservableCollection&lt;T&gt;</code> is the common UI-bound collection type.
      </NoteParagraph>
      <CodeBlock
        language="csharp"
        code={`
public ObservableCollection<WorkOrderRowViewModel> Orders { get; } = [];

public async Task LoadAsync()
{
    if (IsBusy)
    {
        return;
    }

    try
    {
        IsBusy = true;
        IReadOnlyList<WorkOrder> orders = await _workOrderService.GetOpenOrdersAsync();

        Orders.Clear();
        foreach (WorkOrder order in orders)
        {
            Orders.Add(new WorkOrderRowViewModel(order));
        }
    }
    finally
    {
        IsBusy = false;
    }
}
        `}
      />
      <NoteTopicGroup>
        <NoteTopicBlock title="Threading Rule">
          <NoteParagraph className="mb-0">
            MAUI marshals ordinary property-change binding updates to the UI thread, but collection mutations are different. If a background thread adds, removes, or clears an <code>ObservableCollection&lt;T&gt;</code> that the UI is reading, dispatch the mutation to the main thread or replace the whole collection through a property change.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <CodeBlock
        language="csharp"
        code={`
IReadOnlyList<WorkOrder> loaded = await _workOrderService.GetOpenOrdersAsync();

MainThread.BeginInvokeOnMainThread(() =>
{
    Orders.Clear();
    foreach (WorkOrder order in loaded)
    {
        Orders.Add(new WorkOrderRowViewModel(order));
    }
});
        `}
      />

      <NoteSectionTitle id="commands-validation-and-user-intent">14. Commands, Validation, and User Intent</NoteSectionTitle>
      <NoteParagraph>
        Commands turn UI gestures into ViewModel actions. A command can say whether it can currently execute. Buttons and other command-aware controls use that to enable or disable themselves. In plain MAUI, <code>Command</code> and <code>Command&lt;T&gt;</code> implement <code>ICommand</code>.
      </NoteParagraph>
      <CodeBlock
        language="csharp"
        code={`
public sealed class OrderDetailViewModel : ViewModelBase
{
    private readonly IWorkOrderService _workOrderService;
    private string _notes = string.Empty;

    public OrderDetailViewModel(IWorkOrderService workOrderService)
    {
        _workOrderService = workOrderService;
        SaveCommand = new Command(
            execute: async () => await SaveAsync(),
            canExecute: () => CanSave);
    }

    public Command SaveCommand { get; }

    public string Notes
    {
        get => _notes;
        set
        {
            if (SetProperty(ref _notes, value))
            {
                OnPropertyChanged(nameof(CanSave));
                SaveCommand.ChangeCanExecute();
            }
        }
    }

    public bool CanSave => !IsBusy && Notes.Trim().Length >= 3;

    private async Task SaveAsync()
    {
        if (!CanSave)
        {
            return;
        }

        try
        {
            IsBusy = true;
            SaveCommand.ChangeCanExecute();
            await _workOrderService.SaveNotesAsync(Notes.Trim());
        }
        finally
        {
            IsBusy = false;
            SaveCommand.ChangeCanExecute();
        }
    }
}
        `}
      />
      <NoteParagraph>
        Validation should live near the state it validates. Simple screen validation can live in the ViewModel. Reusable business validation should move into domain services or model-level policies so multiple screens and tests share the same rules.
      </NoteParagraph>

      <NoteSectionTitle id="dependency-injection-and-mauiprogram">15. Dependency Injection and MauiProgram</NoteSectionTitle>
      <NoteParagraph>
        MAUI apps commonly use the built-in Microsoft dependency injection container. Register pages, ViewModels, services, HTTP clients, logging, and platform abstractions in <code>MauiProgram.CreateMauiApp()</code>. Constructor injection then makes dependencies explicit and testable.
      </NoteParagraph>
      <CodeBlock
        language="csharp"
        code={`
using FieldOps.Services;
using FieldOps.ViewModels;
using FieldOps.Views;
using Microsoft.Extensions.Logging;

namespace FieldOps;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        MauiAppBuilder builder = MauiApp.CreateBuilder();

        builder
            .UseMauiApp<App>()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
            });

        builder.Services.AddSingleton<IWorkOrderService, WorkOrderService>();
        builder.Services.AddSingleton<ISecureTokenStore, SecureTokenStore>();
        builder.Services.AddHttpClient<IWorkOrderApi, WorkOrderApi>(client =>
        {
            client.BaseAddress = new Uri("https://api.example.com/");
        });

        builder.Services.AddTransient<OrdersViewModel>();
        builder.Services.AddTransient<OrderDetailViewModel>();
        builder.Services.AddTransient<OrdersPage>();
        builder.Services.AddTransient<OrderDetailPage>();

#if DEBUG
        builder.Logging.AddDebug();
#endif

        return builder.Build();
    }
}
        `}
      />
      <NoteTable
        headers={['lifetime', 'meaning', 'typical MAUI use']}
        rows={[
          ['Singleton', 'one instance for the app lifetime', 'configuration, token store, cache, app-level service'],
          ['Transient', 'new instance each time requested', 'pages and ViewModels that represent screen instances'],
          ['Scoped', 'one instance per scope; less common in client MAUI unless you create scopes deliberately', 'unit-of-work or session-like flows'],
        ]}
      />

      <NoteSectionTitle id="shell-navigation-routes-and-parameters">16. Shell Navigation, Routes, and Parameters</NoteSectionTitle>
      <NoteParagraph>
        Shell gives a MAUI app a common navigation structure: flyouts, tabs, pages, and URI-like routes. Shell can describe the top-level visual hierarchy in XAML and navigate to detail pages by route.
      </NoteParagraph>
      <CodeBlock
        language="xml"
        code={`
<Shell
    x:Class="FieldOps.AppShell"
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:views="clr-namespace:FieldOps.Views">

    <FlyoutItem Title="Operations">
        <ShellContent
            Title="Orders"
            ContentTemplate="{DataTemplate views:OrdersPage}"
            Route="orders" />
    </FlyoutItem>
</Shell>
        `}
      />
      <CodeBlock
        language="csharp"
        code={`
namespace FieldOps;

public partial class AppShell : Shell
{
    public AppShell()
    {
        InitializeComponent();
        Routing.RegisterRoute(nameof(OrderDetailPage), typeof(OrderDetailPage));
    }
}
        `}
      />
      <CodeBlock
        language="csharp"
        code={`
await Shell.Current.GoToAsync(
    $"{nameof(OrderDetailPage)}?id={order.Id}");
        `}
      />
      <NoteParagraph>
        Route parameters can be passed through query strings. In code-behind or ViewModels, <code>IQueryAttributable</code> or query-property attributes can receive those values. For larger apps, a navigation service can wrap Shell to keep navigation policy in one place.
      </NoteParagraph>

      <NoteSectionTitle id="services-http-dtos-and-data-flow">17. Services, HTTP, DTOs, and Data Flow</NoteSectionTitle>
      <NoteParagraph>
        Services keep I/O and integration logic out of ViewModels. A common shape is API service returns DTOs, mapper converts DTOs into models, ViewModel converts models into row ViewModels, and XAML binds to those row ViewModels.
      </NoteParagraph>
      <CodeBlock
        language="csharp"
        code={`
namespace FieldOps.Services;

public interface IWorkOrderService
{
    Task<IReadOnlyList<WorkOrder>> GetOpenOrdersAsync(
        CancellationToken cancellationToken = default);

    Task<WorkOrder> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task SaveNotesAsync(
        int id,
        string notes,
        CancellationToken cancellationToken = default);
}
        `}
      />
      <CodeBlock
        language="csharp"
        code={`
public sealed class WorkOrderService : IWorkOrderService
{
    private readonly HttpClient _httpClient;

    public WorkOrderService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<IReadOnlyList<WorkOrder>> GetOpenOrdersAsync(
        CancellationToken cancellationToken = default)
    {
        WorkOrderDto[]? response = await _httpClient
            .GetFromJsonAsync<WorkOrderDto[]>("api/work-orders/open", cancellationToken);

        return response?.Select(WorkOrderMapper.ToModel).ToList() ?? [];
    }

    public async Task<WorkOrder> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        WorkOrderDto? response = await _httpClient
            .GetFromJsonAsync<WorkOrderDto>($"api/work-orders/{id}", cancellationToken);

        return response is null
            ? throw new InvalidOperationException($"Work order {id} was not found.")
            : WorkOrderMapper.ToModel(response);
    }

    public async Task SaveNotesAsync(
        int id,
        string notes,
        CancellationToken cancellationToken = default)
    {
        using HttpResponseMessage response = await _httpClient.PostAsJsonAsync(
            $"api/work-orders/{id}/notes",
            new { notes },
            cancellationToken);

        response.EnsureSuccessStatusCode();
    }
}
        `}
      />
      <NoteTable
        headers={['type', 'purpose']}
        rows={[
          ['DTO', 'matches wire format from an API; often nullable and shaped by backend contracts'],
          ['Model', 'represents app/domain meaning; can enforce stronger invariants'],
          ['Mapper', 'keeps conversion explicit and testable'],
          ['Service interface', 'lets ViewModels depend on behavior instead of concrete HTTP details'],
          ['Service implementation', 'owns HttpClient, serialization, retries, error translation, and integration concerns'],
        ]}
      />

      <NoteSectionTitle id="app-lifecycle-state-and-cancellation">18. App Lifecycle, State, and Cancellation</NoteSectionTitle>
      <NoteParagraph>
        MAUI apps move through foreground, background, resume, sleep, destroy, window, and page lifecycle events depending on platform. Page lifecycle methods such as <code>OnAppearing</code> and <code>OnDisappearing</code> are useful, but they can run more often than expected when navigating, tabbing, or returning to a page.
      </NoteParagraph>
      <BulletList>
        <li>Make load methods idempotent, or explicitly decide when a reload should happen.</li>
        <li>Use <code>IsBusy</code> or operation IDs to prevent duplicate commands.</li>
        <li>Use <code>CancellationTokenSource</code> when leaving a page should cancel an in-flight request.</li>
        <li>Persist important state before backgrounding if data loss would matter.</li>
        <li>Do not assume every platform calls lifecycle events in exactly the same order.</li>
      </BulletList>
      <CodeBlock
        language="csharp"
        code={`
private CancellationTokenSource? _loadCancellation;

public async Task RefreshAsync()
{
    _loadCancellation?.Cancel();
    _loadCancellation = new CancellationTokenSource();

    try
    {
        IReadOnlyList<WorkOrder> orders =
            await _workOrderService.GetOpenOrdersAsync(_loadCancellation.Token);

        ReplaceOrders(orders);
    }
    catch (OperationCanceledException)
    {
        // The user navigated away or started a newer refresh.
    }
}
        `}
      />

      <NoteSectionTitle id="resources-styles-layout-and-theming">19. Resources, Styles, Layout, and Theming</NoteSectionTitle>
      <NoteParagraph>
        MAUI resources let you define colors, styles, templates, fonts, dimensions, and reusable values in one place. Global resources usually live in <code>App.xaml</code> and merged dictionaries under <code>Resources/Styles</code>.
      </NoteParagraph>
      <CodeBlock
        language="xml"
        code={`
<Application
    x:Class="FieldOps.App"
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml">

    <Application.Resources>
        <ResourceDictionary>
            <ResourceDictionary.MergedDictionaries>
                <ResourceDictionary Source="Resources/Styles/Colors.xaml" />
                <ResourceDictionary Source="Resources/Styles/Styles.xaml" />
            </ResourceDictionary.MergedDictionaries>
        </ResourceDictionary>
    </Application.Resources>
</Application>
        `}
      />
      <CodeBlock
        language="xml"
        code={`
<Style TargetType="Button">
    <Setter Property="CornerRadius" Value="6" />
    <Setter Property="Padding" Value="14,10" />
    <Setter Property="FontAttributes" Value="Bold" />
    <Setter Property="BackgroundColor" Value="{AppThemeBinding Light=#2563EB, Dark=#4ADE80}" />
    <Setter Property="TextColor" Value="{AppThemeBinding Light=White, Dark=Black}" />
</Style>
        `}
      />
      <NoteTable
        headers={['layout', 'best use']}
        rows={[
          ['Grid', 'most forms and pages; precise rows and columns without excessive nesting'],
          ['VerticalStackLayout', 'simple vertical flow with known small number of children'],
          ['HorizontalStackLayout', 'simple horizontal groups such as icon plus text'],
          ['CollectionView', 'lists and grids of repeated items; preferred over many manually repeated controls'],
          ['ScrollView', 'single scrollable content area; avoid wrapping large virtualized lists inside it'],
        ]}
      />

      <NoteSectionTitle id="platform-specific-code-permissions-and-device-apis">20. Platform-Specific Code, Permissions, and Device APIs</NoteSectionTitle>
      <NoteParagraph>
        MAUI gives cross-platform APIs for many device features, but real apps often need platform-specific manifests, permissions, entitlements, and implementations. Keep platform differences behind interfaces when they affect ViewModels or services.
      </NoteParagraph>
      <NoteTable
        headers={['concern', 'Android', 'iOS/Mac Catalyst', 'Windows']}
        rows={[
          ['permissions', 'AndroidManifest.xml plus runtime permission requests for dangerous permissions', 'Info.plist usage descriptions and entitlements', 'Package.appxmanifest capabilities'],
          ['entry point', 'MainActivity and MainApplication', 'AppDelegate', 'WinUI App.xaml and package manifest'],
          ['native APIs', 'Platforms/Android classes or partial methods', 'Platforms/iOS or Platforms/MacCatalyst classes', 'Platforms/Windows classes'],
          ['build target', 'net10.0-android', 'net10.0-ios or net10.0-maccatalyst', 'net10.0-windows10.0.19041.0 or similar'],
        ]}
      />
      <CodeBlock
        language="csharp"
        code={`
public interface IDeviceIdentityService
{
    string GetDeviceFamily();
}

// Shared fallback
public sealed partial class DeviceIdentityService : IDeviceIdentityService
{
    public partial string GetDeviceFamily();
}
        `}
      />
      <CodeBlock
        language="csharp"
        code={`
// Platforms/Android/DeviceIdentityService.android.cs
public sealed partial class DeviceIdentityService
{
    public partial string GetDeviceFamily() => "Android";
}

// Platforms/Windows/DeviceIdentityService.windows.cs
public sealed partial class DeviceIdentityService
{
    public partial string GetDeviceFamily() => "Windows";
}
        `}
      />
      <NoteParagraph>
        Prefer MAUI cross-platform APIs first when they meet the requirement. Use platform-specific code when behavior, platform policy, native SDKs, or app-store requirements force it.
      </NoteParagraph>

      <NoteSectionTitle id="testing-debugging-and-hot-reload">21. Testing, Debugging, and Hot Reload</NoteSectionTitle>
      <NoteParagraph>
        The easiest MAUI code to test is code that does not reference UI controls. That is another reason to keep ViewModels and services clean. Unit test models, mappers, services with fake HTTP handlers, ViewModels with fake services, and validation logic without launching a device emulator.
      </NoteParagraph>
      <CodeBlock
        language="csharp"
        code={`
public sealed class FakeWorkOrderService : IWorkOrderService
{
    public Task<IReadOnlyList<WorkOrder>> GetOpenOrdersAsync(
        CancellationToken cancellationToken = default)
    {
        IReadOnlyList<WorkOrder> orders =
        [
            new WorkOrder(1, "Replace sensor", "North Plant", WorkOrderStatus.New, DateTimeOffset.UtcNow)
        ];

        return Task.FromResult(orders);
    }

    public Task<WorkOrder> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(new WorkOrder(id, "Replace sensor", "North Plant", WorkOrderStatus.New, DateTimeOffset.UtcNow));
    }

    public Task SaveNotesAsync(int id, string notes, CancellationToken cancellationToken = default)
    {
        return Task.CompletedTask;
    }
}
        `}
      />
      <CodeBlock
        language="csharp"
        code={`
[Fact]
public async Task LoadAsync_populates_orders()
{
    var viewModel = new OrdersViewModel(new FakeWorkOrderService());

    await viewModel.LoadAsync();

    Assert.Single(viewModel.Orders);
    Assert.Equal("Replace sensor", viewModel.Orders[0].Title);
}
        `}
      />
      <BulletList>
        <li>Use Hot Reload for fast UI iteration, but still run clean builds after structural XAML, resource, or project-file changes.</li>
        <li>Use compiled bindings and nullable warnings as early bug detectors.</li>
        <li>Use device logs for platform failures that do not reproduce on Windows desktop.</li>
        <li>Use linker/trimming checks before release because debug builds can hide reflection and dynamic dependency problems.</li>
        <li>Test on real devices before trusting sensors, connectivity, biometrics, deep links, camera, file pickers, push notifications, and app lifecycle behavior.</li>
      </BulletList>

      <NoteSectionTitle id="performance-production-and-maintainability">22. Performance, Production, and Maintainability</NoteSectionTitle>
      <NoteParagraph>
        MAUI performance is usually shaped by startup work, layout depth, list virtualization, image sizes, binding cost, network behavior, and platform-specific rendering. Start with simple architecture and measure before adding complicated abstractions.
      </NoteParagraph>
      <NoteTable
        headers={['risk', 'better pattern']}
        rows={[
          ['heavy work in App constructor or first page constructor', 'defer noncritical work, show a loading state, initialize services lazily'],
          ['deep nested StackLayouts', 'use Grid and fewer layout passes'],
          ['large images shipped at original size', 'use MAUI image resources and right-sized assets'],
          ['unbounded CollectionView item templates', 'keep templates light and use virtualization-friendly layouts'],
          ['many runtime bindings with misspelled paths', 'use x:DataType and compiled bindings'],
          ['ViewModels directly new up services', 'constructor-inject interfaces for testability'],
          ['catch-all exceptions with no telemetry', 'translate expected errors and log unexpected failures with context'],
          ['tokens in plain preferences', 'use SecureStorage or platform credential mechanisms when appropriate'],
        ]}
      />
      <NoteTopicGroup>
        <NoteTopicBlock title="Production Checklist">
          <BulletList className="mb-0">
            <li>Know the target .NET version and install the latest supported patch.</li>
            <li>Pin package versions and document required SDK, workload, Xcode, Android SDK, and JDK versions.</li>
            <li>Enable nullable reference types and treat warnings seriously.</li>
            <li>Use a consistent ViewModel base or MVVM toolkit across the app.</li>
            <li>Keep secrets out of source control and app bundles whenever possible.</li>
            <li>Define logging and crash reporting for release builds.</li>
            <li>Exercise offline, slow network, expired token, permission denied, background/resume, and app upgrade scenarios.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="end-to-end-work-orders-example">23. End-to-End Work Orders Example</NoteSectionTitle>
      <NoteParagraph>
        The following small feature shows how the pieces fit together. The app lists open work orders, lets the user open a detail screen, and saves notes. The point is not the domain; the point is the flow across Model, DTO, service, ViewModel, XAML, code-behind, DI, and Shell.
      </NoteParagraph>

      <NoteSubSectionTitle id="work-orders-model-and-dto">Model and DTO</NoteSubSectionTitle>
      <CodeBlock
        language="csharp"
        code={`
namespace FieldOps.Models;

public sealed record WorkOrder(
    int Id,
    string Title,
    string CustomerName,
    WorkOrderStatus Status,
    DateTimeOffset DueAt);

public enum WorkOrderStatus
{
    New,
    InProgress,
    Blocked,
    Complete
}

namespace FieldOps.Dtos;

public sealed record WorkOrderDto(
    int Id,
    string? Title,
    string? CustomerName,
    string? Status,
    DateTimeOffset? DueAt);
        `}
      />
      <CodeBlock
        language="csharp"
        code={`
public static class WorkOrderMapper
{
    public static WorkOrder ToModel(WorkOrderDto dto)
    {
        string title = string.IsNullOrWhiteSpace(dto.Title)
            ? "Untitled order"
            : dto.Title;

        string customer = string.IsNullOrWhiteSpace(dto.CustomerName)
            ? "Unknown customer"
            : dto.CustomerName;

        WorkOrderStatus status = Enum.TryParse(dto.Status, ignoreCase: true, out WorkOrderStatus parsed)
            ? parsed
            : WorkOrderStatus.New;

        return new WorkOrder(
            dto.Id,
            title,
            customer,
            status,
            dto.DueAt ?? DateTimeOffset.UtcNow);
    }
}
        `}
      />

      <NoteSubSectionTitle id="work-orders-row-viewmodel">Row ViewModel</NoteSubSectionTitle>
      <CodeBlock
        language="csharp"
        code={`
namespace FieldOps.ViewModels;

public sealed class WorkOrderRowViewModel
{
    public WorkOrderRowViewModel(WorkOrder order)
    {
        Id = order.Id;
        Title = order.Title;
        CustomerName = order.CustomerName;
        Status = order.Status.ToString();
        DueText = order.DueAt.ToLocalTime().ToString("MMM d, h:mm tt");
    }

    public int Id { get; }
    public string Title { get; }
    public string CustomerName { get; }
    public string Status { get; }
    public string DueText { get; }
}
        `}
      />

      <NoteSubSectionTitle id="work-orders-page-viewmodel">Orders Page ViewModel</NoteSubSectionTitle>
      <CodeBlock
        language="csharp"
        code={`
public sealed class OrdersViewModel : ViewModelBase
{
    private readonly IWorkOrderService _workOrderService;
    private string _searchText = string.Empty;

    public OrdersViewModel(IWorkOrderService workOrderService)
    {
        _workOrderService = workOrderService;
        RefreshCommand = new Command(async () => await LoadAsync(), () => !IsBusy);
        OpenOrderCommand = new Command<WorkOrderRowViewModel>(
            async order => await OpenOrderAsync(order),
            order => order is not null);
    }

    public ObservableCollection<WorkOrderRowViewModel> Orders { get; } = [];
    public Command RefreshCommand { get; }
    public Command<WorkOrderRowViewModel> OpenOrderCommand { get; }

    public string SearchText
    {
        get => _searchText;
        set
        {
            if (SetProperty(ref _searchText, value))
            {
                OnPropertyChanged(nameof(FilteredOrders));
            }
        }
    }

    public IEnumerable<WorkOrderRowViewModel> FilteredOrders =>
        string.IsNullOrWhiteSpace(SearchText)
            ? Orders
            : Orders.Where(order =>
                order.Title.Contains(SearchText, StringComparison.OrdinalIgnoreCase) ||
                order.CustomerName.Contains(SearchText, StringComparison.OrdinalIgnoreCase));

    public async Task LoadAsync()
    {
        if (IsBusy)
        {
            return;
        }

        try
        {
            IsBusy = true;
            RefreshCommand.ChangeCanExecute();

            IReadOnlyList<WorkOrder> loaded =
                await _workOrderService.GetOpenOrdersAsync();

            Orders.Clear();
            foreach (WorkOrder order in loaded)
            {
                Orders.Add(new WorkOrderRowViewModel(order));
            }

            OnPropertyChanged(nameof(FilteredOrders));
        }
        finally
        {
            IsBusy = false;
            RefreshCommand.ChangeCanExecute();
        }
    }

    private static async Task OpenOrderAsync(WorkOrderRowViewModel? order)
    {
        if (order is null)
        {
            return;
        }

        await Shell.Current.GoToAsync($"{nameof(OrderDetailPage)}?id={order.Id}");
    }
}
        `}
      />

      <NoteSubSectionTitle id="work-orders-xaml-and-code-behind">Orders XAML and Code-Behind</NoteSubSectionTitle>
      <CodeBlock
        language="xml"
        code={`
<ContentPage
    x:Class="FieldOps.Views.OrdersPage"
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:vm="clr-namespace:FieldOps.ViewModels"
    x:DataType="vm:OrdersViewModel"
    Title="Orders">

    <Grid RowDefinitions="Auto,Auto,*" Padding="16" RowSpacing="12">
        <SearchBar
            Placeholder="Search by title or customer"
            Text="{Binding SearchText}" />

        <Button
            Grid.Row="1"
            Text="Refresh"
            Command="{Binding RefreshCommand}" />

        <CollectionView
            Grid.Row="2"
            ItemsSource="{Binding FilteredOrders}"
            SelectionMode="None">
            <CollectionView.EmptyView>
                <Label Text="No open orders." HorizontalTextAlignment="Center" />
            </CollectionView.EmptyView>

            <CollectionView.ItemTemplate>
                <DataTemplate x:DataType="vm:WorkOrderRowViewModel">
                    <Grid ColumnDefinitions="*,Auto" Padding="8" RowDefinitions="Auto,Auto,Auto">
                        <Label Text="{Binding Title}" FontAttributes="Bold" />
                        <Label Grid.Row="1" Text="{Binding CustomerName}" FontSize="12" />
                        <Label Grid.Row="2" Text="{Binding DueText}" FontSize="12" />

                        <Button
                            Grid.Column="1"
                            Grid.RowSpan="3"
                            Text="Open"
                            Command="{Binding Source={RelativeSource AncestorType={x:Type vm:OrdersViewModel}}, Path=OpenOrderCommand}"
                            CommandParameter="{Binding .}" />
                    </Grid>
                </DataTemplate>
            </CollectionView.ItemTemplate>
        </CollectionView>
    </Grid>
</ContentPage>
        `}
      />
      <CodeBlock
        language="csharp"
        code={`
namespace FieldOps.Views;

public partial class OrdersPage : ContentPage
{
    private readonly OrdersViewModel _viewModel;

    public OrdersPage(OrdersViewModel viewModel)
    {
        InitializeComponent();
        _viewModel = viewModel;
        BindingContext = _viewModel;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        await _viewModel.LoadAsync();
    }
}
        `}
      />

      <NoteSubSectionTitle id="work-orders-detail-page">Detail Page</NoteSubSectionTitle>
      <CodeBlock
        language="csharp"
        code={`
public sealed class OrderDetailViewModel : ViewModelBase, IQueryAttributable
{
    private readonly IWorkOrderService _workOrderService;
    private int _id;
    private string _title = string.Empty;
    private string _notes = string.Empty;

    public OrderDetailViewModel(IWorkOrderService workOrderService)
    {
        _workOrderService = workOrderService;
        SaveCommand = new Command(async () => await SaveAsync(), () => CanSave);
    }

    public string Title
    {
        get => _title;
        private set => SetProperty(ref _title, value);
    }

    public string Notes
    {
        get => _notes;
        set
        {
            if (SetProperty(ref _notes, value))
            {
                OnPropertyChanged(nameof(CanSave));
                SaveCommand.ChangeCanExecute();
            }
        }
    }

    public bool CanSave => !IsBusy && Notes.Trim().Length >= 3;
    public Command SaveCommand { get; }

    public async void ApplyQueryAttributes(IDictionary<string, object> query)
    {
        if (query.TryGetValue("id", out object? rawId) &&
            int.TryParse(rawId?.ToString(), out int id))
        {
            _id = id;
            await LoadAsync();
        }
    }

    private async Task LoadAsync()
    {
        WorkOrder order = await _workOrderService.GetByIdAsync(_id);
        Title = order.Title;
    }

    private async Task SaveAsync()
    {
        if (!CanSave)
        {
            return;
        }

        try
        {
            IsBusy = true;
            SaveCommand.ChangeCanExecute();
            await _workOrderService.SaveNotesAsync(_id, Notes.Trim());
            await Shell.Current.GoToAsync("..");
        }
        finally
        {
            IsBusy = false;
            SaveCommand.ChangeCanExecute();
        }
    }
}
        `}
      />
      <CodeBlock
        language="xml"
        code={`
<ContentPage
    x:Class="FieldOps.Views.OrderDetailPage"
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:vm="clr-namespace:FieldOps.ViewModels"
    x:DataType="vm:OrderDetailViewModel"
    Title="{Binding Title}">

    <Grid RowDefinitions="Auto,*,Auto" Padding="16" RowSpacing="12">
        <Label Text="{Binding Title}" FontAttributes="Bold" FontSize="20" />

        <Editor
            Grid.Row="1"
            Placeholder="Enter completion notes"
            Text="{Binding Notes}"
            AutoSize="TextChanges" />

        <Button
            Grid.Row="2"
            Text="Save Notes"
            Command="{Binding SaveCommand}" />
    </Grid>
</ContentPage>
        `}
      />

      <NoteSectionTitle id="official-reference-links">24. Official Reference Links</NoteSectionTitle>
      <NoteParagraph>
        These notes were checked against Microsoft documentation current in June 2026:
      </NoteParagraph>
      <BulletList>
        <li><a className="underline" href="https://learn.microsoft.com/en-us/dotnet/maui/what-is-maui?view=net-maui-10.0" target="_blank" rel="noreferrer">What is .NET MAUI?</a></li>
        <li><a className="underline" href="https://learn.microsoft.com/en-us/dotnet/maui/supported-platforms?view=net-maui-10.0" target="_blank" rel="noreferrer">Supported platforms for .NET MAUI apps</a></li>
        <li><a className="underline" href="https://learn.microsoft.com/en-us/dotnet/maui/xaml/fundamentals/get-started?view=net-maui-10.0" target="_blank" rel="noreferrer">Get started with .NET MAUI XAML</a></li>
        <li><a className="underline" href="https://learn.microsoft.com/en-us/dotnet/maui/xaml/fundamentals/mvvm?view=net-maui-10.0" target="_blank" rel="noreferrer">Data binding and MVVM</a></li>
        <li><a className="underline" href="https://learn.microsoft.com/en-us/dotnet/maui/fundamentals/data-binding/?view=net-maui-10.0" target="_blank" rel="noreferrer">Data binding</a></li>
        <li><a className="underline" href="https://learn.microsoft.com/en-us/dotnet/maui/fundamentals/shell/?view=net-maui-10.0" target="_blank" rel="noreferrer">.NET MAUI Shell overview</a></li>
        <li><a className="underline" href="https://learn.microsoft.com/en-us/dotnet/maui/fundamentals/single-project?view=net-maui-10.0" target="_blank" rel="noreferrer">.NET MAUI single project</a></li>
        <li><a className="underline" href="https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-version-history" target="_blank" rel="noreferrer">C# language version history</a></li>
        <li><a className="underline" href="https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core" target="_blank" rel="noreferrer">.NET support policy</a></li>
      </BulletList>
    </NotesLayout>
  );
}
